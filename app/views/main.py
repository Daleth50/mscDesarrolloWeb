from app.view_model.main import MainViewModel
from flask import render_template

class MainView:
    def __init__(self):
        pass
    
    def render(self):
        return render_template("index.html")
    