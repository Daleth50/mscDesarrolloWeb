from flask import render_template
from app.view_model.order.list import OrderListViewModel


class OrderListView:
    def __init__(self):
        self.order_list_view_model = OrderListViewModel()

    def render(self):
        orders = self.order_list_view_model.get_orders_table_data()
        return render_template("orders/list-orders.html", orders=orders)
