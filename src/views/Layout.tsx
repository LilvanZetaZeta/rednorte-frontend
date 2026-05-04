import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLayoutVM } from '../viewmodels/useLayoutVM';

export default function Layout() {
  const location = useLocation();
  // Conectamos la Vista con su ViewModel
  const vm = useLayoutVM();

  // Configuración de rutas dinámicas según el rol
  const menuItems = [
    ...(vm.userRole === 'paciente' ? [
      { name: 'Mis Reservas', path: '/portal', icon: 'calendar_month' },
      { name: 'Agendar Hora', path: '/agendar', icon: 'add_circle' },
    ] : []),
    ...(vm.userRole === 'doctor' ? [
      { name: 'Mi Agenda', path: '/doctor/agenda', icon: 'event_available' },
      { name: 'Historial Pacientes', path: '/doctor/pacientes', icon: 'clinical_notes' },
    ] : []),
    ...(vm.userRole === 'admin' ? [
      { name: 'Dashboard Central', path: '/admin/dashboard', icon: 'analytics' },
      { name: 'Gestión Personal', path: '/admin/personal', icon: 'badge' },
    ] : [])
  ];

  return (
    <div className="bg-background min-h-screen text-on-background font-body-md selection:bg-primary-container selection:text-on-primary-container">
      
      <header className="fixed top-0 w-full z-50 h-16 bg-white/95 backdrop-blur-md border-b border-surface-variant shadow-sm flex justify-between items-center px-4 lg:px-6 transition-opacity">
        <div className="flex items-center gap-3">
          <button 
            onClick={vm.toggleMobileMenu}
            className="lg:hidden p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant flex items-center justify-center"
          >
            <span className="material-symbols-outlined">{vm.isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
          
          <div className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
            RedNorte CMS
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="font-label-md text-sm text-on-surface font-bold">{vm.userName}</span>
            <span className="font-caption text-xs text-on-surface-variant capitalize">{vm.userRole}</span>
          </div>
          <button 
            onClick={vm.handleCerrarSesion}
            title="Cerrar Sesión"
            className="text-error hover:bg-error-container hover:text-on-error-container transition-colors p-2 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface-container-lowest border-r border-surface-variant z-40 transform transition-transform duration-300 ease-in-out ${vm.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <nav className="p-4 flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={vm.closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-full font-label-md text-sm transition-colors ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container font-bold' 
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {vm.isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={vm.closeMobileMenu}
        />
      )}

      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet /> 
        </div>
      </main>
      
    </div>
  );
}