from qdrant_client import QdrantClient

client = QdrantClient(url="http://localhost:6333")

print(hasattr(client, "search"))
print(hasattr(client, "query_points"))