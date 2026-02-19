import logging
import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from flask_cors import CORS

# Load environment variables before importing config
load_dotenv()

from app.config import config
from app.database import db
import app.models
from app.routes import main_bp
from flask_migrate import Migrate


def create_app(config_name=None):
    """Application factory"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__, static_folder='static/dist', static_url_path='')
    app.config.from_object(config.get(config_name, config['default']))
    
    # Initialize CORS - permitir frontend en desarrollo
    CORS(app)
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # Register blueprints
    from app.routes import main_bp, api_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)
    
    # Servir SPA en desarrollo/producción
    @app.route('/')
    def serve_spa_root():
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/<path:path>')
    def serve_spa(path):
        # No servir SPA para rutas de API
        if path.startswith('api/'):
            from flask import abort
            abort(404)
        
        # Si el archivo existe, servirlo
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        # Si no, servir index.html para que React Router maneje la ruta
        return send_from_directory(app.static_folder, 'index.html')
    
    # Setup logging
    setup_logging(app)
    
    return app


def setup_logging(app):
    """Configure application logging"""
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)
