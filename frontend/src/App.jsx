import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Layouts
import ShopLayout from './layouts/ShopLayout';
import AdminLayout from './layouts/AdminLayout';

// 2. Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard'; 
import AdminProducts from './pages/AdminProducts';
import AdminUsers from './pages/AdminUsers'; 
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import MyPurchases from './pages/MyPurchases';
import Products from './pages/Products';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas (Vistas por Clientes y Visitantes) */}
        <Route element={<ShopLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/carrito" element={<Cart />} /> 
          <Route path="/mis-compras" element={<MyPurchases />} />
        </Route>

        {/* Rutas de Administración (Protegidas) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProducts />} /> 
          <Route path="productos" element={<AdminProducts />} />
          <Route path="usuarios" element={<AdminUsers />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;