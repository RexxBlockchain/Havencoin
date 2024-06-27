import os

class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "default_mongodb_uri")
    TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "default_telegram_bot_token")
