import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLayoutVM } from '../viewmodels/useLayoutVM';
import { ShieldPlus, Menu, LogOut, Calendar, PlusCircle, BarChart3, Users, Building2, Activity, FileText } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const vm = useLayoutVM();

  const menuItems = [
    ...(vm.userRole === 'paciente' ? [
      { name: 'Mis Reservas', path: '/portal', icon: Calendar }, 
      { name: 'Agendar Hora', path: '/agendar', icon: PlusCircle }
    ] : []),
    ...(vm.userRole === 'director' ? [
      { name: 'Dashboard Ejecutivo', path: '/director/portal', icon: BarChart3 }, 
      { name: 'Gestión de Centros', path: '/director/centros', icon: Building2 },
      { name: 'Gestión de Especialidades', path: '/director/especialidades', icon: Activity },
      { name: 'Gestión de Staff', path: '/admin/dashboard', icon: Users }
    ] : []),
    ...(vm.userRole === 'administrativo' ? [
      { name: 'Mi Sucursal', path: '/admin/centro', icon: Building2 }
    ] : []),
    ...(vm.userRole === 'medico' ? [
      { name: 'Mi Agenda', path: '/doctor/agenda', icon: Calendar },
      { name: 'Buscar Ficha', path: '/doctor/historial', icon: FileText }
    ] : [])
  ];

  return (
    <div className="bg-background min-h-screen text-on-background font-body-md">
      {/* HEADER: Logo redirige siempre a la landing page '/' */}
      <header className="fixed top-0 w-full z-50 h-16 bg-white/95 backdrop-blur-md border-b border-surface-variant flex justify-between items-center px-4 lg:px-6">
        
        <div className="flex items-center gap-3">
          <button onClick={vm.toggleMobileMenu} className="lg:hidden p-2 hover:bg-surface-container-high rounded-full transition-colors">
            <Menu />
          </button>
          
          <Link to="/" className="text-lg font-bold text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ShieldPlus /> RedNorte
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="font-bold text-sm">{vm.userName}</span>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{vm.userRole}</span>
          </div>
          <button 
            onClick={vm.handleCerrarSesion} 
            className="text-error p-2 hover:bg-error-container rounded-full transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* SIDEBAR: Navegación privada */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface-container-lowest border-r border-surface-variant z-40 transition-transform ${vm.isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <nav className="p-4 flex flex-col gap-2">
          {menuItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={vm.closeMobileMenu} 
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors ${
                location.pathname.startsWith(item.path) 
                  ? 'bg-secondary-container font-bold text-on-secondary-container' 
                  : 'hover:bg-surface-container-low text-on-surface'
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="pt-16 lg:ml-64 min-h-screen">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}