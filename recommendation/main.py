import os
import mysql.connector
from fastapi import FastAPI
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import redis
import json

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")  
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))    
REDIS_DB = int(os.getenv("REDIS_DB", 0))           
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None) 

MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "password")
MYSQL_DB = os.getenv("MYSQL_DB", "debate_db")


app = FastAPI()

redis_client = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, password=REDIS_PASSWORD,decode_responses=True)

def get_mysql_connection():
    return mysql.connector.connect(
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB
    )

# def fetch_vote_data():
#     connection = get_mysql_connection()
#     cursor = connection.cursor(dictionary=True)
    
#     cursor.execute("SELECT user_id, debate_id, is_agree FROM votes")  # MySQL의 votes 테이블
#     vote_data = cursor.fetchall()
    
#     cursor.close()
#     connection.close()
#     return vote_data



# 샘플 투표 데이터 (실제 데이터는 DB에서 가져와야 함)
vote_data = [
    {"user_id": "U1", "debate_id": "D1", "is_agree": 1},
    {"user_id": "U1", "debate_id": "D3", "is_agree": 0},
    {"user_id": "U2", "debate_id": "D1", "is_agree": 1},
    {"user_id": "U2", "debate_id": "D2", "is_agree": 1},
    {"user_id": "U3", "debate_id": "D3", "is_agree": 1},
    {"user_id": "U3", "debate_id": "D4", "is_agree": 0},
]

# 사용자-토론 행렬 생성
df_votes = pd.DataFrame(vote_data)
user_debate_matrix = df_votes.pivot_table(index="user_id", columns="debate_id", values="is_agree", fill_value=0)

#  아이템(토론) 기반 행렬 생성
debate_user_matrix = user_debate_matrix.T

# 코사인 유사도 계산
debate_similarity = cosine_similarity(debate_user_matrix)
debate_similarity_df = pd.DataFrame(debate_similarity, index=debate_user_matrix.index, columns=debate_user_matrix.index)

# 추천 생성 및 Redis 저장
def save_recommended_debate(user_id: str) -> str:
    """
    특정 사용자에게 가장 유사한 토론 1개를 추천하고 Redis에 저장
    """
    try:
        # 사용자가 찬성한 토론 목록 가져오기
        liked_debates = user_debate_matrix.loc[user_id][user_debate_matrix.loc[user_id] > 0].index.tolist()
        
        if not liked_debates:
            return "ERROR: No liked debates found" 

        # 가장 최근 찬성한 토론 선택
        recent_debate = liked_debates[-1]

        # 해당 토론과 유사한 토론 찾기
        similar_debates = debate_similarity_df[recent_debate].drop(index=liked_debates, errors='ignore')

        if similar_debates.empty:
            return "ERROR: No similar debates found" 

        # 유사도가 가장 높은 토론 선택
        recommended_debate = similar_debates.idxmax()

        # Redis에 저장 (TTL 24시간 설정)
        redis_client.setex(f"recommended_debate:{user_id}", 86400, recommended_debate)

        return "OK"

    except Exception as e:
        return f"ERROR: {str(e)}"

# API: 추천 생성 요청 처리
@app.post("/api/recommendation/{user_id}")
async def generate_recommendation(user_id: str):
    """
    추천을 생성하여 Redis에 저장하는 API (성공 시 'OK' 반환)
    """
    result = save_recommended_debate(user_id)
    if result == "OK":
        return {"status": "OK"}
    else:
        return {"status": "ERROR", "message": result}