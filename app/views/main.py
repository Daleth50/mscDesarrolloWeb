from app.view_model.main import MainViewModel
from flask import render_template

class MainView:
    def __init__(self):
        pass
    
    def render(self):
        products = MainViewModel().get_index_data()
        return render_template("index.html", products=products)
    