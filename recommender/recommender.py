import sys
import os
import json
import boto3
import implicit
import pandas as pd
import scipy.sparse as sparse
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

s3_bucket = os.environ.get('S3_BUCKET')
s3_csv_path = os.environ.get('S3_CSV_PATH')

# Connect to S3 bucket
session = boto3.Session(profile_name='default')
s3 = session.resource('s3')
s3bucket = s3.Bucket(s3_bucket)

timestamps = []

for obj in s3bucket.objects.filter(
    Prefix=s3_csv_path,
    Marker=s3_csv_path
):
    if obj.key.endswith('.csv'):
        timestamps.append(int(os.path.splitext(os.path.basename(obj.key))[0]))

latest_file_timestamp = max(timestamps)


def create_data(data):
    df = pd.read_csv(data)
    df = df[['USER_ID', 'ITEM_ID', 'EVENT_TYPE']]
    return df


def find_value(data, has, looking_for, value):
    return data.loc[data[has] == value][looking_for].values[0]


async def recommend(USER_ID, ITEMS_NUMBER):

    source_path = f's3://{s3_bucket}/{s3_csv_path}/{latest_file_timestamp}.csv'
    data = create_data(source_path)
    data['userid'] = data['USER_ID'].astype("category")
    data['itemid'] = data['ITEM_ID'].astype("category")
    data['eventtype'] = data['EVENT_TYPE'].astype('category')
    data['user_id'] = data['userid'].cat.codes
    data['item_id'] = data['itemid'].cat.codes
    data['event_type'] = data['eventtype'].cat.codes

    user_id = ""

    try:
        user_id = find_value(data, 'USER_ID', 'user_id', USER_ID)
    except IndexError:
        return {'error': 'User not found.'}

    sparse_item_user = sparse.csr_matrix(
        (data['event_type'], (data['item_id'], data['user_id'])))
    sparse_user_item = sparse.csr_matrix(
        (data['event_type'], (data['user_id'], data['item_id'])))

    # Prepare model
    model = implicit.als.AlternatingLeastSquares(
        factors=50, regularization=0.1, iterations=20)

    # alpha_val = 40
    # data_conf = (sparse_item_user * alpha_val).astype('double')
    data_conf = sparse_item_user.astype('double')

    # Train model
    model.fit(data_conf)

    # Run recommendation process
    recommended = model.recommend(
        user_id, sparse_user_item, ITEMS_NUMBER, True)
    parsed_recommended = {}

    for i in recommended:
        parsed_recommended[find_value(
            data, 'item_id', 'ITEM_ID', i[0])] = i[1].item()

    return parsed_recommended


# print(recommend('6188c1ed58e0fca32c15788a'))

# Get similar items
# item_id = 7
# n_similar = 3
# similar = model.similar_items(item_id, n_similar)
# print(similar)
