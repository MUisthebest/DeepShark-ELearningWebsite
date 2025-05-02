from sentence_transformers import SentenceTransformer
import docker

class ModelLoader:
    def __init__(self):
        self.model = None
        self.container_name = "22127471/model-only"  # Tên image trên Docker Hub
        self.container = None  # Thêm biến lưu container

    def load_from_docker(self):
        """Tải model trực tiếp từ container đang chạy"""
        try:
            client = docker.from_env()
            
            # Khởi động container với model trong memory
            self.container = client.containers.run(
                self.container_name,
                detach=True,
                remove=True,  # Tự động xóa container khi dừng
                mem_limit="500m"  # Giới hạn RAM
            )
            
            # Truy cập model trực tiếp từ container
            self.model = SentenceTransformer("/app/model")  # Đường dẫn trong container
            return self.model
            
        except Exception as e:
            print(f"Lỗi khi tải model từ Docker: {e}")
            # Fallback: tải từ HuggingFace
            return SentenceTransformer("BanhMiKepThit015/Deepshark-Paraphrase-MiniLM-v2")

    def __del__(self):
        """Dọn dẹp container khi hủy đối tượng"""
        if self.container:
            self.container.stop()

def get_query_embedding(query):
    loader = ModelLoader()
    model = loader.load_from_docker()
    return model.encode(query)