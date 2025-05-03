from sentence_transformers import SentenceTransformer
import os

class ModelLoader:
    def __init__(self):
        self.model_name = "BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2"
        self.local_dir = "model"
        self.model = None

    def load(self):
        if self.model is None:
            if os.path.exists(self.local_dir):
                # Load from local
                print("Loading model from local directory...")
                self.model = SentenceTransformer(self.local_dir)
            else:
                # Load online and save
                print("Downloading model from HuggingFace...")
                self.model = SentenceTransformer(self.model_name)
                self.model.save(self.local_dir)
        return self.model

def get_query_embedding(query):
    loader = ModelLoader()
    model = loader.load()
    return model.encode(query)
