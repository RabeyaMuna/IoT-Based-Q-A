import os
from dotenv import load_dotenv        
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import  AzureChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.runnables import RunnablePassthrough
from langchain_community.embeddings.sentence_transformer import (
    SentenceTransformerEmbeddings
)
from langchain import hub
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser


load_dotenv()

def initialize_model():
    client = AzureChatOpenAI(
                azure_deployment=os.getenv("DEPLOYMENT_NAME"),
                model = "gpt-35-turbo",
                api_key = os.getenv("OPENAI_API_KEY"),  
                api_version = os.getenv("API_VERSION"),
                azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
            )

    dataset_path = os.getenv("DATASET_PATH", "./Datasets/IoT.pdf")
    loader = PyPDFLoader(dataset_path)
    data = loader.load()

    # split it into chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(data)

    embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    db = Chroma.from_documents(docs, embedding_function, persist_directory="Datasets/chroma_db")

    embedding_function = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    vectordb = Chroma(persist_directory="Datasets/chroma_db", embedding_function=embedding_function)
    retriever = vectordb.as_retriever()

    prompt = hub.pull("rlm/rag-prompt")

    return retriever, prompt, client


def create_rag_pipeline():
    retriever, prompt, client = initialize_model()
    # Define the format_docs function
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    # Define the RAG pipeline
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | client
        | StrOutputParser()
    )

    return rag_chain
