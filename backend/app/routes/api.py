from flask import Blueprint, jsonify, request
from app.view_model.product.main import ProductViewModel
from app.view_model.contact.main import ContactViewModel
from app.view_model.order.main import OrderViewModel

api_bp = Blueprint("api", __name__, url_prefix="/api")


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
    """Listar todas las órdenes"""
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
