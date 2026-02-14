from app.view_model.order.main import OrderViewModel


class OrderListViewModel:
    def __init__(self):
        self.order_service = OrderViewModel()

    def get_orders_table_data(self):
        return self.order_service.list_orders()
