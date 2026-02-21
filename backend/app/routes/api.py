from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash
from app.view_model.product.main import ProductViewModel
from app.view_model.contact.main import ContactViewModel
from app.view_model.order.main import OrderViewModel
from app.view_model.user import UserViewModel
from app.auth import generate_token, get_authenticated_user

api_bp = Blueprint("api", __name__, url_prefix="/api")


@api_bp.before_request
def require_authentication():
    if request.method == "OPTIONS":
        return None
    if request.path in {"/api/auth/login", "/api/auth/me"}:
        return None

    user = get_authenticated_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return None


# ==================== AUTH ====================

@api_bp.route("/auth/login", methods=["POST"])
def login():
    """Iniciar sesion"""
    try:
        data = request.get_json() or {}
        identifier = (data.get("identifier") or "").strip()
        password = data.get("password") or ""
        if not identifier or not password:
            return jsonify({"error": "Identifier and password are required"}), 400

        user = UserViewModel.get_user_by_email(identifier)
        if not user:
            user = UserViewModel.get_user_by_username(identifier)

        if not user or not user.is_active:
            return jsonify({"error": "Invalid credentials"}), 401

        if not check_password_hash(user.password, password) and user.password != password:
            return jsonify({"error": "Invalid credentials"}), 401

        token = generate_token(user.id)
        return jsonify({"token": token, "user": user.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/auth/me", methods=["GET"])
def me():
    """Obtener usuario autenticado"""
    try:
        user = get_authenticated_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        return jsonify({"user": user.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/auth/me", methods=["PUT"])
def update_me():
    """Actualizar perfil del usuario autenticado"""
    try:
        user = get_authenticated_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.get_json() or {}
        updated_user = UserViewModel.update_profile(user, data)
        return jsonify({"user": updated_user}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== PRODUCTS ====================

@api_bp.route("/products", methods=["GET"])
def get_products():
    """Listar todos los productos"""
    try:
        products = ProductViewModel.get_all_products()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/products/<string:product_id>", methods=["GET"])
def get_product(product_id):
    """Obtener detalle de un producto"""
    try:
        product = ProductViewModel.get_product_by_id(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/products", methods=["POST"])
def create_product():
    """Crear nuevo producto"""
    try:
        data = request.get_json()
        new_product = ProductViewModel.create_product(data)
        return jsonify(new_product), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/products/<string:product_id>", methods=["PUT"])
def update_product(product_id):
    """Actualizar producto"""
    try:
        data = request.get_json()
        updated_product = ProductViewModel.update_product(product_id, data)
        return jsonify(updated_product), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/products/<string:product_id>", methods=["DELETE"])
def delete_product(product_id):
    """Eliminar producto"""
    try:
        ProductViewModel.delete_product(product_id)
        return jsonify({"message": "Product deleted"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== CATEGORIES ====================

@api_bp.route("/categories", methods=["GET"])
def get_categories():
    """Listar categorías de productos"""
    try:
        categories = ProductViewModel.get_categories()
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/categories", methods=["POST"])
def create_category():
    """Crear nueva categoría"""
    try:
        data = request.get_json() or {}
        new_category = ProductViewModel.create_category(data)
        return jsonify(new_category), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/categories/<string:category_id>", methods=["PUT"])
def update_category(category_id):
    """Actualizar categoría"""
    try:
        data = request.get_json() or {}
        updated_category = ProductViewModel.update_category(category_id, data)
        return jsonify(updated_category), 200
    except ValueError as e:
        status_code = 404 if str(e) == "Category not found" else 400
        return jsonify({"error": str(e)}), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/categories/<string:category_id>", methods=["DELETE"])
def delete_category(category_id):
    """Eliminar categoría"""
    try:
        ProductViewModel.delete_category(category_id)
        return jsonify({"message": "Category deleted"}), 200
    except ValueError as e:
        error = str(e)
        status_code = 404 if error == "Category not found" else 400
        return jsonify({"error": error}), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== CONTACTS ====================

@api_bp.route("/contacts", methods=["GET"])
def get_contacts():
    """Listar todos los contactos"""
    try:
        contacts = ContactViewModel.get_all_contacts()
        return jsonify(contacts), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/contacts", methods=["POST"])
def create_contact():
    """Crear nuevo contacto"""
    try:
        data = request.get_json()
        new_contact = ContactViewModel.create_contact(data)
        return jsonify(new_contact), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== ORDERS ====================

@api_bp.route("/orders", methods=["GET"])
def get_orders():
    """Listar todas las Ventas"""
    try:
        orders = OrderViewModel.get_all_orders()
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/orders", methods=["POST"])
def create_order():
    """Crear nueva orden"""
    try:
        data = request.get_json()
        new_order = OrderViewModel.create_order(data)
        return jsonify(new_order), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== USERS ====================

@api_bp.route("/users", methods=["GET"])
def get_users():
    """Listar todos los usuarios"""
    try:
        users = UserViewModel.get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/users/<string:user_id>", methods=["GET"])
def get_user(user_id):
    """Obtener detalle de un usuario"""
    try:
        user = UserViewModel.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/users", methods=["POST"])
def create_user():
    """Crear nuevo usuario"""
    try:
        data = request.get_json()
        new_user = UserViewModel.create_user(data)
        return jsonify(new_user), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/users/<string:user_id>", methods=["PUT"])
def update_user(user_id):
    """Actualizar usuario"""
    try:
        data = request.get_json()
        updated_user = UserViewModel.update_user(user_id, data)
        return jsonify(updated_user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/users/<string:user_id>", methods=["DELETE"])
def delete_user(user_id):
    """Eliminar usuario"""
    try:
        UserViewModel.delete_user(user_id)
        return jsonify({"message": "User deleted"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
