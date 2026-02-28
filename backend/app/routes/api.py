from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
from app.view_model.product.main import ProductViewModel
from app.view_model.contact.main import ContactViewModel
from app.view_model.order.main import OrderViewModel
from app.view_model.user import UserViewModel
from app.view_model.bill_account import BillAccountViewModel
from app.auth import (
    generate_token,
    get_authenticated_user,
)
from app.database import db
from app.models.base import User

api_bp = Blueprint("api", __name__, url_prefix="/api")


def _require_admin_user():
    user = get_authenticated_user()
    if not user:
        raise PermissionError("Unauthorized")
    if user.role != "admin":
        raise PermissionError("Admin role required")
    return user


@api_bp.before_request
def require_authentication():
    if request.method == "OPTIONS":
        return None
    if request.path in {
        "/api/auth/login",
        "/api/auth/me",
        "/api/auth/password/forgot",
        "/api/auth/password/reset",
    }:
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


@api_bp.route("/auth/password/forgot", methods=["POST"])
def forgot_password():
    """Solicitar restauración de contraseña (flujo de prueba sin token)"""
    try:
        data = request.get_json() or {}
        identifier = (data.get("identifier") or data.get("email") or "").strip()
        if not identifier:
            return jsonify({"error": "Identifier is required"}), 400

        user = UserViewModel.get_user_by_email(identifier)
        if not user:
            user = UserViewModel.get_user_by_username(identifier)

        if not user or not user.is_active:
            return jsonify({"error": "User not found or inactive"}), 404

        return jsonify({"message": "Solicitud aceptada", "identifier": identifier}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/auth/password/reset", methods=["POST"])
def reset_password():
    """Restaurar contraseña por identificador (flujo de prueba sin token)"""
    try:
        data = request.get_json() or {}
        identifier = (data.get("identifier") or data.get("email") or "").strip()
        new_password = data.get("new_password") or ""

        if not identifier:
            return jsonify({"error": "Identifier is required"}), 400
        if not new_password or len(new_password) < 6:
            return jsonify({"error": "New password must have at least 6 characters"}), 400

        user = UserViewModel.get_user_by_email(identifier)
        if not user:
            user = UserViewModel.get_user_by_username(identifier)
        if not user or not user.is_active:
            return jsonify({"error": "User not found or inactive"}), 404

        user.password = generate_password_hash(new_password)
        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 200
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
        kind = request.args.get("kind")
        contacts = ContactViewModel.get_contacts_by_kind(kind)
        return jsonify(contacts), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/contacts", methods=["POST"])
def create_contact():
    """Crear nuevo contacto"""
    try:
        data = request.get_json() or {}
        new_contact = ContactViewModel.create_contact(data)
        return jsonify(new_contact), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/suppliers", methods=["GET"])
def get_suppliers():
    """Listar proveedores"""
    try:
        suppliers = ContactViewModel.get_contacts_by_kind("supplier")
        return jsonify(suppliers), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/suppliers", methods=["POST"])
def create_supplier():
    """Crear nuevo proveedor"""
    try:
        data = request.get_json() or {}
        new_supplier = ContactViewModel.create_supplier(data)
        return jsonify(new_supplier), 201
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


# ==================== POS (CART) ====================

@api_bp.route("/pos/products", methods=["GET"])
def get_pos_products():
    """Listar productos para POS con stock"""
    try:
        products = OrderViewModel.list_pos_products()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/pos/bill-accounts", methods=["GET"])
def get_pos_bill_accounts():
    """Listar cuentas de banco para POS por tipo"""
    try:
        account_type = (request.args.get("type") or "").strip().lower()
        if account_type:
            accounts = BillAccountViewModel.get_bill_accounts_by_type(account_type)
        else:
            accounts = BillAccountViewModel.get_all_bill_accounts()
        return jsonify(accounts), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route("/pos/cart", methods=["POST"])
def create_cart():
    """Crear carrito en estado inicial"""
    try:
        data = request.get_json() or {}
        cart = OrderViewModel.create_cart(data)
        return jsonify(cart), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/pos/cart/<string:cart_id>", methods=["GET"])
def get_cart(cart_id):
    """Obtener carrito con items"""
    try:
        cart = OrderViewModel.get_cart(cart_id)
        return jsonify(cart), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/pos/cart/<string:cart_id>", methods=["PUT"])
def update_cart(cart_id):
    """Actualizar datos del carrito"""
    try:
        data = request.get_json() or {}
        cart = OrderViewModel.update_cart(cart_id, data)
        return jsonify(cart), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/pos/cart/<string:cart_id>/items", methods=["POST"])
def add_cart_item(cart_id):
    """Agregar producto al carrito"""
    try:
        data = request.get_json() or {}
        cart = OrderViewModel.add_cart_item(cart_id, data)
        return jsonify(cart), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/pos/cart/<string:cart_id>/items/<string:item_id>", methods=["PUT"])
def update_cart_item(cart_id, item_id):
    """Editar cantidad de item del carrito"""
    try:
        data = request.get_json() or {}
        cart = OrderViewModel.update_cart_item(cart_id, item_id, data)
        return jsonify(cart), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/pos/cart/<string:cart_id>/items/<string:item_id>", methods=["DELETE"])
def remove_cart_item(cart_id, item_id):
    """Eliminar item del carrito"""
    try:
        cart = OrderViewModel.remove_cart_item(cart_id, item_id)
        return jsonify(cart), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/pos/cart/<string:cart_id>/complete", methods=["POST"])
def complete_cart(cart_id):
    """Completar venta POS"""
    try:
        data = request.get_json() or {}
        sale = OrderViewModel.complete_cart(cart_id, data)
        return jsonify(sale), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==================== PURCHASES (CART) ====================

@api_bp.route("/purchases/products", methods=["GET"])
def get_purchase_products():
    """Listar productos para compras"""
    try:
        products = OrderViewModel.list_purchase_products()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/purchases/cart", methods=["POST"])
def create_purchase_cart():
    """Crear carrito de compra"""
    try:
        data = request.get_json() or {}
        cart = OrderViewModel.create_purchase_cart(data)
        return jsonify(cart), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/purchases/cart/<string:cart_id>", methods=["GET"])
def get_purchase_cart(cart_id):
    """Obtener carrito de compra"""
    try:
        cart = OrderViewModel.get_purchase_cart(cart_id)
        return jsonify(cart), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/purchases/cart/<string:cart_id>", methods=["PUT"])
def update_purchase_cart(cart_id):
    """Actualizar carrito de compra"""
    try:
        data = request.get_json() or {}
        cart = OrderViewModel.update_purchase_cart(cart_id, data)
        return jsonify(cart), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/purchases/cart/<string:cart_id>/items", methods=["POST"])
def add_purchase_item(cart_id):
    """Agregar producto al carrito de compra"""
    try:
        data = request.get_json() or {}
        cart = OrderViewModel.add_purchase_item(cart_id, data)
        return jsonify(cart), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/purchases/cart/<string:cart_id>/items/<string:item_id>", methods=["PUT"])
def update_purchase_item(cart_id, item_id):
    """Editar cantidad de item del carrito de compra"""
    try:
        data = request.get_json() or {}
        cart = OrderViewModel.update_purchase_item(cart_id, item_id, data)
        return jsonify(cart), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/purchases/cart/<string:cart_id>/items/<string:item_id>", methods=["DELETE"])
def remove_purchase_item(cart_id, item_id):
    """Eliminar item del carrito de compra"""
    try:
        cart = OrderViewModel.remove_purchase_item(cart_id, item_id)
        return jsonify(cart), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/purchases/cart/<string:cart_id>/complete", methods=["POST"])
def complete_purchase_cart(cart_id):
    """Completar compra y actualizar stock"""
    try:
        cart = OrderViewModel.complete_purchase_cart(cart_id)
        return jsonify(cart), 200
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


# ==================== BILL ACCOUNTS ====================

@api_bp.route("/bill-accounts", methods=["GET"])
def get_bill_accounts():
    """Listar cuentas de banco"""
    try:
        _require_admin_user()
        accounts = BillAccountViewModel.get_all_bill_accounts()
        return jsonify(accounts), 200
    except PermissionError as e:
        status = 401 if str(e) == "Unauthorized" else 403
        return jsonify({"error": str(e)}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/bill-accounts/<string:account_id>", methods=["GET"])
def get_bill_account(account_id):
    """Obtener cuenta de banco"""
    try:
        _require_admin_user()
        account = BillAccountViewModel.get_bill_account_by_id(account_id)
        if not account:
            return jsonify({"error": "Bill account not found"}), 404
        return jsonify(account), 200
    except PermissionError as e:
        status = 401 if str(e) == "Unauthorized" else 403
        return jsonify({"error": str(e)}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/bill-accounts", methods=["POST"])
def create_bill_account():
    """Crear cuenta de banco"""
    try:
        _require_admin_user()
        data = request.get_json() or {}
        account = BillAccountViewModel.create_bill_account(data)
        return jsonify(account), 201
    except PermissionError as e:
        status = 401 if str(e) == "Unauthorized" else 403
        return jsonify({"error": str(e)}), status
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/bill-accounts/<string:account_id>", methods=["PUT"])
def update_bill_account(account_id):
    """Actualizar cuenta de banco"""
    try:
        _require_admin_user()
        data = request.get_json() or {}
        account = BillAccountViewModel.update_bill_account(account_id, data)
        return jsonify(account), 200
    except PermissionError as e:
        status = 401 if str(e) == "Unauthorized" else 403
        return jsonify({"error": str(e)}), status
    except ValueError as e:
        status = 404 if str(e) == "Bill account not found" else 400
        return jsonify({"error": str(e)}), status
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route("/bill-accounts/<string:account_id>", methods=["DELETE"])
def delete_bill_account(account_id):
    """Eliminar cuenta de banco"""
    try:
        _require_admin_user()
        BillAccountViewModel.delete_bill_account(account_id)
        return jsonify({"message": "Bill account deleted"}), 200
    except PermissionError as e:
        status = 401 if str(e) == "Unauthorized" else 403
        return jsonify({"error": str(e)}), status
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
