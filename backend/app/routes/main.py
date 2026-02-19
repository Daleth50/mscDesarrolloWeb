from flask import Blueprint, jsonify

main_bp = Blueprint("main", __name__)


@main_bp.route("/health", methods=["GET"])
def health():
    """Health check for load balancers"""
    return jsonify({"status": "healthy"}), 200

