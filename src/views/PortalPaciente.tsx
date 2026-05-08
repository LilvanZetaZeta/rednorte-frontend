import { Link } from 'react-router-dom';
import { usePortalPacienteVM } from '../viewmodels/usePortalPacienteVM';
import { Stethoscope, CalendarDays, User, Phone, Shield, Pencil } from 'lucide-react';
import { useState } from 'react';

export default function PortalPaciente() {
  const { userName, userRut, userEmail, reservas, perfil, isLoading, handleCancelar, handleGuardarPerfil } = usePortalPacienteVM();
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [prevision, setPrevision] = useState('');
  const [telefono, setTelefono] = useState('');

  const abrirEdicion = () => {
    setPrevision(perfil?.prevision || '');
    setTelefono(perfil?.telefonoContacto || '');
    setEditandoPerfil(true);
  };

  const guardar = async () => {
    await handleGuardarPerfil({ prevision, telefonoContacto: telefono });
    setEditandoPerfil(false);
  };

  if (isLoading) return <div className="p-12 text-center text-primary">Cargando tu portal...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* CABECERA */}
      <section>
        <h1 className="font-h1 text-h1 mb-1">Buenos días, {userName}.</h1>
        <p className="text-on-surface-variant">Este es tu resumen de salud.</p>
      </section>

      {/* TARJETA DE PERFIL — datos desde ms-portal + Supabase */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-h3 text-h3 flex items-center gap-2">
            <User className="text-primary w-5 h-5" /> Mi Perfil
          </h2>
          <button onClick={abrirEdicion} className="flex items-center gap-1 text-sm text-primary hover:underline">
            <Pencil className="w-4 h-4" /> Editar
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">RUT</p>
            <p className="font-medium">{userRut || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Correo</p>
            <p className="font-medium text-sm truncate">{userEmail || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Previsión
            </p>
            <p className="font-medium">{perfil?.prevision || <span className="text-on-surface-variant italic text-sm">No registrada</span>}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> Teléfono
            </p>
            <p className="font-medium">{perfil?.telefonoContacto || <span className="text-on-surface-variant italic text-sm">No registrado</span>}</p>
          </div>
        </div>
      </section>

      {/* MODAL EDICIÓN PERFIL */}
      {editandoPerfil && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="font-bold text-lg">Actualizar mi Perfil</h3>
            <div>
              <label className="text-sm font-medium">Previsión</label>
              <input value={prevision} onChange={e => setPrevision(e.target.value)}
                placeholder="Ej: Fonasa A, Isapre Cruz Blanca..."
                className="w-full mt-1 px-4 py-2 rounded-xl bg-surface-container-high border-none outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono de contacto</label>
              <input value={telefono} onChange={e => setTelefono(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full mt-1 px-4 py-2 rounded-xl bg-surface-container-high border-none outline-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditandoPerfil(false)}
                className="flex-1 py-3 border border-outline rounded-xl font-medium">
                Cancelar
              </button>
              <button onClick={guardar}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESERVAS */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-h3 text-h3">Próximas Citas</h2>
          <Link to="/agendar" className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm">
            Nueva Reserva
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservas.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
              <p>No tienes citas agendadas.</p>
            </div>
          ) : (
            reservas.map((res: any) => (
              <div key={res.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <Stethoscope />
                    </div>
                    <div>
                      <h3 className="font-h3 text-body-md">Dr. {res.medico.nombreCompleto}</h3>
                      <p className="text-caption text-on-surface-variant">{res.centro.nombreSucursal}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-medium uppercase">
                    {res.estado}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant mb-5 bg-surface-container-lowest p-2 rounded border border-surface-variant">
                  <CalendarDays className="w-5 h-5" />
                  <span className="text-sm font-medium">{res.fechaHora}</span>
                </div>
                <button onClick={() => handleCancelar(res.id)}
                  className="w-full bg-error/10 text-error py-2.5 rounded-lg text-sm hover:bg-error hover:text-white transition-colors">
                  Cancelar Cita
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}