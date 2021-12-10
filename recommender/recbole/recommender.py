from recbole.trainer import Trainer
from recbole.data import create_dataset, data_preparation
from recbole.config import Config
from recbole.model.sequential_recommender import sasrecf

dataset = {}
config = Config(model='sasrecf', dataset=dataset,
                config_file_list=['config.yaml'])
init_seed(config['seed'], config['reproducibility'])
dataset = create_dataset(config)

train_data, valid_data, test_data = data_preparation(config, dataset)
model = BPR(config, train_data).to(config['device'])
best_valid_score, best_valid_result = trainer.fit(train_data, valid_data)
test_result = trainer.evaluate(test_data)
