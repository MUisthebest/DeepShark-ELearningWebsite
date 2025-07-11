from sentence_transformers import SentenceTransformer
import os

class ModelLoader:
    def __init__(self):
        self.model_name = "BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2"
        self.model = None

    def load(self):
        if self.model is None:
            print("Loading model from HuggingFace Hub...")
            self.model = SentenceTransformer(self.model_name)
        return self.model

def get_query_embedding(query):
    loader = ModelLoader()
    model = loader.load()
    return model.encode(query)