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


if __name__ == "__main__":
    app.run(debug=True)
