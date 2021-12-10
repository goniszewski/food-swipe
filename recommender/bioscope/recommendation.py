import pandas as pd
import scipy.sparse as sp
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_data():
    recipes_data = pd.read_csv('dataset/movie_data.csv.zip')
    recipes_data['name'] = recipes_data['name'].str.lower()
    return recipes_data


def combine_data(data):
    data_recommend = data.drop(columns=['id', 'name', 'description'])
    data_recommend['combine'] = data_recommend[data_recommend.columns[0:2]].apply(
        lambda x: ','.join(x.dropna().astype(str)), axis=1)

    data_recommend = data_recommend.drop(columns=['cast', 'genres'])
    return data_recommend


def transform_data(data_combine, data_plot):
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(data_combine['combine'])

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(data_plot['description'])

    combine_sparse = sp.hstack([count_matrix, tfidf_matrix], format='csr')
    cosine_sim = cosine_similarity(combine_sparse, combine_sparse)

    return cosine_sim


def run_recommend(name, data, combine, transform):
    indices = pd.Series(data.index, index=data['name'])
    index = indices[name]

    sim_scores = list(enumerate(transform[index]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:41]

    indices = [i[0] for i in sim_scores]

    recipe_id = data['id'].iloc[indices]
    name = data['name'].iloc[ndices]
    categories = data['categories'].iloc[indices]

    recommendation_data = pd.DataFrame(columns=['ID', 'Name', 'Categories'])

    recommendation_data['ID'] = recipe_id
    recommendation_data['Name'] = name
    recommendation_data['categories'] = categories

    return recommendation_data


def results(name):
    name = name.lower()

    find_recipe = load_data()
    combine_result = combine_data(find_recipe)
    transform_result = transform_data(combine_result, find_recipe)

    if name not in find_recipe['name'].unique():
        return 'Recipe not found'

    else:
        recommendations = run_recommend(
            name, find_recipe, combine_result, transform_result)
        return recommendations.to_dict('records')
