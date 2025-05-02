from sentence_transformers import SentenceTransformer
import os
import docker

class ModelLoader:
    def __init__(self):
        self.model = None
        self.container_name = "22127471/model-only"
        self.local_path = "local_model_path"

    def load_from_docker(self):
        """Tải model từ Docker Hub và lưu cục bộ"""
        if os.path.exists(self.local_path):
            return SentenceTransformer(self.local_path)
            
        try:
            client = docker.from_env()
            client.images.pull(self.container_name)
            
            # Chạy container và copy model
            container = client.containers.run(
                self.container_name,
                detach=True,
                volumes={os.getcwd(): {'bind': '/host', 'mode': 'rw'}}
            )
            container.exec_run(f"cp -r /app/model /host/{self.local_path}")
            container.stop()
            
            return SentenceTransformer(self.local_path)
            
        except Exception as e:
            print(f"Lỗi khi tải model từ Docker: {e}")
            # Fallback: tải từ HuggingFace nếu cần
            return SentenceTransformer("BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2")

def get_query_embedding(query):
    loader = ModelLoader()
    model = loader.load_from_docker()
    return model.encode(query)
