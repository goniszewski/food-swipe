import sys
import os
import json
import boto3
import pandas as pd
import numpy as np
import scipy.sparse as sparse
from scipy.sparse.linalg import spsolve

from sklearn.preprocessing import MinMaxScaler

import implicit
from datetime import datetime, timedelta

os.environ['OPENBLAS_NUM_THREADS'] = '1'

session = boto3.Session(profile_name='default')
s3 = session.resource('s3')
s3bucket = s3.Bucket('sf-data-storage')

# for obj in s3bucket.objects.all():
#     if obj.key.endswith('.csv'):
#         print(obj.key)
timestamps = []
for obj in s3bucket.objects.filter(
    Prefix='recommender/csv/',
    Marker='recommender/csv/'
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


def get(USER_ID):
    source_path = f's3://sf-data-storage/recommender/csv/{latest_file_timestamp}.csv'
    data = create_data(source_path)
    data['userid'] = data['USER_ID'].astype("category")
    data['itemid'] = data['ITEM_ID'].astype("category")
    data['eventtype'] = data['EVENT_TYPE'].astype('category')
    data['user_id'] = data['userid'].cat.codes
    data['item_id'] = data['itemid'].cat.codes
    data['event_type'] = data['eventtype'].cat.codes

    # print(data.tail(10))
    # print(data.loc[data['user_id'] == 20].head(1)['USER_ID'].values[0])
    sparse_item_user = sparse.csr_matrix(
        (data['event_type'], (data['item_id'], data['user_id'])))
    sparse_user_item = sparse.csr_matrix(
        (data['event_type'], (data['user_id'], data['item_id'])))

    # Building the model
    model = implicit.als.AlternatingLeastSquares(
        factors=50, regularization=0.1, iterations=20)

    alpha_val = 40
    # data_conf = (sparse_item_user * alpha_val).astype('double')
    data_conf = sparse_item_user.astype('double')

    model.fit(data_conf)

    # USING THE MODEL

    # Get Recommendations
    # user_id = data.loc[data['USER_ID'] == USER_ID].head(1)['user_id'].values[0]
    user_id = find_value(data, 'USER_ID', 'user_id', USER_ID)

    recommended = model.recommend(user_id, sparse_user_item, 40, True)
    parsed_recommended = {}

    for i in recommended:
        # parsed_recommended[i[0]] = i[1]
        parsed_recommended[find_value(
            data, 'item_id', 'ITEM_ID', i[0])] = i[1].item()
    dump = json.dumps(parsed_recommended)
    return dump


print(get('6188c1ed58e0fca32c15788a'))

# Get similar items
# item_id = 7
# n_similar = 3
# similar = model.similar_items(item_id, n_similar)
# print(similar)
