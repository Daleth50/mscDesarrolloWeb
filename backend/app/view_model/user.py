from app.database import db
from app.models.base import User
from werkzeug.security import generate_password_hash


class UserViewModel:
    @staticmethod
    def _clean_str(value):
        if value is None:
            return ""
        return str(value).strip()

    @staticmethod
    def get_all_users():
        users = User.query.all()
        return [user.to_dict() for user in users]

    @staticmethod
    def get_user_by_id(user_id):
        user = User.query.get(user_id)
        if not user:
            return None
        return user.to_dict()

    @staticmethod
    def get_user_by_email(email):
        user = User.query.filter(User.email == email).first()
        if not user:
            return None
        return user

    @staticmethod
    def get_user_by_username(username):
        user = User.query.filter(User.username == username).first()
        if not user:
            return None
        return user

    @staticmethod
    def create_user(form_data):
        first_name = UserViewModel._clean_str(form_data.get("first_name", ""))
        last_name = UserViewModel._clean_str(form_data.get("last_name", ""))
        email = UserViewModel._clean_str(form_data.get("email", ""))
        username = UserViewModel._clean_str(form_data.get("username", ""))
        password = UserViewModel._clean_str(form_data.get("password", ""))
        role = UserViewModel._clean_str(form_data.get("role", "user"))

        if not first_name:
            raise ValueError("First name is required")
        if not last_name:
            raise ValueError("Last name is required")
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")
        if not password:
            raise ValueError("Password is required")

        existing_email = User.query.filter(User.email == email).first()
        if existing_email:
            raise ValueError("Email already exists")

        existing_username = User.query.filter(User.username == username).first()
        if existing_username:
            raise ValueError("Username already exists")

        if role not in ["admin", "seller"]:
            raise ValueError("Invalid role")

        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=username,
            password=generate_password_hash(password),
            role=role,
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict()

    @staticmethod
    def update_user(user_id, form_data):
        user = User.query.get(user_id)
        if not user:
            raise ValueError("User not found")

        first_name = UserViewModel._clean_str(form_data.get("first_name", ""))
        last_name = UserViewModel._clean_str(form_data.get("last_name", ""))
        email = UserViewModel._clean_str(form_data.get("email", ""))
        username = UserViewModel._clean_str(form_data.get("username", ""))
        role = UserViewModel._clean_str(form_data.get("role", ""))
        password = UserViewModel._clean_str(form_data.get("password", ""))

        if not first_name:
            raise ValueError("First name is required")
        if not last_name:
            raise ValueError("Last name is required")
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")

        if email != user.email:
            existing_email = User.query.filter(User.email == email).first()
            if existing_email:
                raise ValueError("Email already exists")

        if username != user.username:
            existing_username = User.query.filter(User.username == username).first()
            if existing_username:
                raise ValueError("Username already exists")

        if role and role not in ["admin", "seller"]:
            raise ValueError("Invalid role")

        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.username = username
        if role:
            user.role = role
        if password:
            user.password = generate_password_hash(password)

        db.session.commit()
        return user.to_dict()

    @staticmethod
    def update_profile(user, form_data):
        first_name = UserViewModel._clean_str(form_data.get("first_name", ""))
        last_name = UserViewModel._clean_str(form_data.get("last_name", ""))
        email = UserViewModel._clean_str(form_data.get("email", ""))
        username = UserViewModel._clean_str(form_data.get("username", ""))
        password = UserViewModel._clean_str(form_data.get("password", ""))

        if not first_name:
            raise ValueError("First name is required")
        if not last_name:
            raise ValueError("Last name is required")
        if not email:
            raise ValueError("Email is required")
        if not username:
            raise ValueError("Username is required")

        if email != user.email:
            existing_email = User.query.filter(User.email == email).first()
            if existing_email:
                raise ValueError("Email already exists")

        if username != user.username:
            existing_username = User.query.filter(User.username == username).first()
            if existing_username:
                raise ValueError("Username already exists")

        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.username = username
        if password:
            user.password = generate_password_hash(password)

        db.session.commit()
        return user.to_dict()

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            raise ValueError("User not found")

        db.session.delete(user)
        db.session.commit()
        return True
