import logging
import os
from dotenv import load_dotenv
from flask import Flask

# Load environment variables before importing config
load_dotenv()

from app.config import config
from app.database import db
from app.routes import main_bp
from flask_migrate import Migrate


def create_app(config_name=None):
    """Application factory"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config['default']))
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    
    # Register blueprints
    app.register_blueprint(main_bp)
    
    # Setup logging
    setup_logging(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app


def setup_logging(app):
    """Configure application logging"""
    if not app.debug:
        handler = logging.StreamHandler()
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)
