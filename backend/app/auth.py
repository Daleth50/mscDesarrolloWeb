from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from flask import current_app, request
from app.models.base import User


AUTH_TOKEN_SALT = "auth-token"
PASSWORD_RESET_TOKEN_SALT = "password-reset"


def _get_serializer():
    secret_key = current_app.config.get("SECRET_KEY")
    return URLSafeTimedSerializer(secret_key)


def generate_token(user_id):
    serializer = _get_serializer()
    return serializer.dumps({"user_id": user_id}, salt=AUTH_TOKEN_SALT)


def verify_token(token, max_age_seconds):
    serializer = _get_serializer()
    try:
        data = serializer.loads(token, salt=AUTH_TOKEN_SALT, max_age=max_age_seconds)
    except (BadSignature, SignatureExpired):
        return None
    return data.get("user_id")


def generate_password_reset_token(user_id):
    serializer = _get_serializer()
    return serializer.dumps(
        {"user_id": user_id, "type": "password_reset"},
        salt=PASSWORD_RESET_TOKEN_SALT,
    )


def verify_password_reset_token(token, max_age_seconds):
    serializer = _get_serializer()
    try:
        data = serializer.loads(
            token,
            salt=PASSWORD_RESET_TOKEN_SALT,
            max_age=max_age_seconds,
        )
    except (BadSignature, SignatureExpired):
        return None

    if data.get("type") != "password_reset":
        return None
    return data.get("user_id")


def get_token_from_request():
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    return auth_header.replace("Bearer ", "", 1).strip()


def get_authenticated_user():
    token = get_token_from_request()
    if not token:
        return None

    max_age = current_app.config.get("AUTH_TOKEN_MAX_AGE", 60 * 60 * 8)
    user_id = verify_token(token, max_age)
    if not user_id:
        return None

    user = User.query.get(user_id)
    if not user or not user.is_active:
        return None

    return user
