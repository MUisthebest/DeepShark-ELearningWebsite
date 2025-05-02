from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

finetuned_modelSBERT = SentenceTransformer("BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2")
finetuned_modelSBERT.save("local_model_path")

def load_model():
    model_path = "local_model_path"
    if os.path.exists(model_path):
        return SentenceTransformer(model_path)
    else:
        model = SentenceTransformer("BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2")
        model.save(model_path)
        return model

def get_query_embedding(query):
    model = load_model()
    return model.encode(query)

