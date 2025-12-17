import { Routes, Route } from 'react-router-dom';

// Importamos todas nuestras páginas
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage'; // CAMBIADO: ProductsPage → GamesPage
import GameDetailPage from './pages/GameDetailPage'; // CAMBIADO: ProductDetailPage → GameDetailPage
import NosotrosPage from './pages/NosotrosPage';
import ContactoPage from './pages/ContactoPage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CarritoPage from './pages/CarritoPage';
import PaymentResultPage from './pages/PaymentResultPage'; 
import ProfilePage from './pages/ProfilePage';
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGamesPage from './pages/AdminGamesPage'; // CAMBIADO: AdminProductsPage → AdminGamesPage
import AdminNewGamePage from './pages/AdminNewGamePage'; // CAMBIADO: AdminNewProductPage → AdminNewGamePage
import AdminUsersPage from './pages/AdminUsersPage';

function App() {
  
  return (
  <Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/login" element={<LoginPage />} />
  
  <Route element={<MainLayout />}>
    <Route path="/home" element={<HomePage />} />
    
    {/* SOLO ESTA RUTA PARA TODOS LOS PRODUCTOS */}
    <Route path="/catalogo" element={<GamesPage />} />
    <Route path="/catalogo/:id" element={<GameDetailPage />} />
    
    {/* ELIMINAR: /juegos, /consolas, /accesorios, /retro, /ofertas */}
    
    <Route path="/nosotros" element={<NosotrosPage />} />
    <Route path="/contacto" element={<ContactoPage />} />
    <Route path="/blogs" element={<BlogsPage />} />
    <Route path="/blogs/:id" element={<BlogDetailPage />} />
    <Route path="/carrito" element={<CarritoPage />} />
    <Route path="/payment-result" element={<PaymentResultPage />} />
    <Route path="/perfil" element={<ProfilePage />} />
    
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="games" element={<AdminGamesPage />} />
      <Route path="games/nuevo" element={<AdminNewGamePage />} />
      <Route path="usuarios" element={<AdminUsersPage />} />
    </Route>
  </Route>
</Routes>
  );
}

export default App;