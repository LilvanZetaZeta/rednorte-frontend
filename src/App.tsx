import { Routes, Route, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './views/Home';
import Reservas from './views/Reservas';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div style={{ padding: '2rem' }}>Cargando sistema...</div>;

  return (
    <div className="app-container">
      <nav style={{ padding: '1rem', background: '#2c3e50', color: 'white', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0, marginRight: '2rem' }}>RedNorte</h2>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
        
        {isAuthenticated && <Link to="/reservas" style={{ color: 'white', textDecoration: 'none' }}>Mis Reservas</Link>}
        
        <div style={{ marginLeft: 'auto' }}>
          {!isAuthenticated ? (
            <button onClick={() => loginWithRedirect()} style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>Iniciar Sesión</button>
          ) : (
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>
              Cerrar Sesión
            </button>
          )}
        </div>
      </nav>

      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservas" element={isAuthenticated ? <Reservas /> : <h2>Acceso Denegado</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;