from fastapi import FastAPI, HTTPException
from typing import Optional

from recommender import recommend

app = FastAPI()


@app.get("/recommendations/{user_id}")
async def get_recommendations(user_id: str, count: Optional[int] = 10):
    response = await recommend(user_id, count)

    if "error" in response:
        raise HTTPException(status_code=404, detail=response['error'])

    return response
