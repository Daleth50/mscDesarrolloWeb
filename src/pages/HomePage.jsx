export default function HomePage() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a AppWeb</h1>
      <p className="text-slate-600 mb-4">
        Sistema de gestión de productos, contactos y órdenes.
      </p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <a href="/products" className="p-4 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
          <h3 className="font-semibold text-blue-600">Productos</h3>
          <p className="text-sm text-slate-600">Gestiona tu catálogo</p>
        </a>
        <a href="/contacts" className="p-4 bg-green-50 border border-green-200 rounded hover:bg-green-100">
          <h3 className="font-semibold text-green-600">Contactos</h3>
          <p className="text-sm text-slate-600">Administra clientes</p>
        </a>
        <a href="/orders" className="p-4 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100">
          <h3 className="font-semibold text-purple-600">Órdenes</h3>
          <p className="text-sm text-slate-600">Visualiza pedidos</p>
        </a>
      </div>
    </div>
  );
}
