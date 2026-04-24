#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
向量存储实现
"""
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings, HuggingFaceEmbeddings
from langchain.document_loaders import TextLoader
from langchain.text_splitter import CharacterTextSplitter
from typing import List, Optional


class VectorStore:
    def __init__(self, embedding_model="openai", model_name="text-embedding-ada-002"):
        """初始化向量存储"""
        if embedding_model == "openai":
            self.embeddings = OpenAIEmbeddings(model=model_name)
        elif embedding_model == "huggingface":
            self.embeddings = HuggingFaceEmbeddings(model_name=model_name)
        else:
            raise ValueError("Invalid embedding model")
        
        self.vectorstore = None
    
    def add_documents(self, documents: List[str]) -> None:
        """添加文档"""
        # 分割文档
        text_splitter = CharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        # 处理文档
        texts = []
        for doc in documents:
            chunks = text_splitter.split_text(doc)
            texts.extend(chunks)
        
        # 创建向量存储
        self.vectorstore = FAISS.from_texts(texts, self.embeddings)
    
    def add_document_from_file(self, file_path: str) -> None:
        """从文件添加文档"""
        loader = TextLoader(file_path, encoding="utf-8")
        documents = loader.load()
        
        # 分割文档
        text_splitter = CharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        texts = text_splitter.split_documents(documents)
        
        # 创建向量存储
        if self.vectorstore is None:
            self.vectorstore = FAISS.from_documents(texts, self.embeddings)
        else:
            self.vectorstore.add_documents(texts)
    
    def similarity_search(self, query: str, k: int = 3) -> List[str]:
        """相似度搜索"""
        if self.vectorstore is None:
            return []
        
        results = self.vectorstore.similarity_search(query, k=k)
        return [doc.page_content for doc in results]
    
    def similarity_search_with_score(self, query: str, k: int = 3) -> List[tuple]:
        """带分数的相似度搜索"""
        if self.vectorstore is None:
            return []
        
        results = self.vectorstore.similarity_search_with_score(query, k=k)
        return [(doc.page_content, score) for doc, score in results]
    
    def save(self, path: str) -> None:
        """保存向量存储"""
        if self.vectorstore is not None:
            self.vectorstore.save_local(path)
    
    def load(self, path: str) -> None:
        """加载向量存储"""
        self.vectorstore = FAISS.load_local(path, self.embeddings)


if __name__ == "__main__":
    # 示例使用
    vector_store = VectorStore(embedding_model="huggingface", model_name="BAAI/bge-small-en")
    
    # 添加文档
    documents = [
        "AI agents are software programs that use artificial intelligence to perform tasks autonomously.",
        "LangChain is a framework for developing applications powered by language models.",
        "RAG stands for Retrieval-Augmented Generation, which combines retrieval with generation."
    ]
    vector_store.add_documents(documents)
    
    # 相似度搜索
    results = vector_store.similarity_search("What is LangChain?")
    print("Search results:")
    for i, result in enumerate(results):
        print(f"{i+1}. {result}")
    
    # 带分数的搜索
    results_with_score = vector_store.similarity_search_with_score("What is RAG?")
    print("\nSearch results with score:")
    for i, (result, score) in enumerate(results_with_score):
        print(f"{i+1}. {result} (Score: {score:.4f})")
