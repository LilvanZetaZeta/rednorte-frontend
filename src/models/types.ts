
export interface IEspecialidad { 
  id: number; nombre: string; 
}

export interface ICentroMedico { 
  id: number; nombreSucursal: string; region: string; comuna: string; direccion: string; 
}

export interface IUsuario {
   id: number; idAuth: string; rut: string; nombreCompleto: string; correo: string; rol: string; especialidades?: IEspecialidad[]; centroMedico?: ICentroMedico;
  }
  
export interface IReserva { 
  id: number; paciente: IUsuario; medico: IUsuario; centro: ICentroMedico; fechaHora: string; estado: string; origen: string; especialidad?: string; 
}

export interface DashboardResumen { 
  totalReservas: number; reservasVigentes: number; reservasCanceladas: number; totalPacientes: number; totalMedicos: number; totalCentros: number; totalEspecialidades: number; 
}

export interface CentroMetrica { 
  nombreCentro: string; cantidadReservas: number; 
}