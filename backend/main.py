from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "Hello, World!"


@app.route("/health")
def health():
    return "Healthy", 200

products = [
    {'id': 1, 'name': 'Product A'},
    {'id': 2, 'name': 'Product B'},
    {'id': 3, 'name': 'Product C'}
]

# Ruta detalle de producto
@app.route("/product/<int:product_id>")
def product_detail(product_id):
    product = next((p for p in products if p['id'] == product_id), None)
    if product:
        name = product['name']
        return f'Product ID: {product_id}, Name: {name}'
    else:
        return 'Product not found', 404


if __name__ == "__main__":
    app.run(debug=True)
