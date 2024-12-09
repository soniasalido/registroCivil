import { writable } from 'svelte/store';

// Tipos de datos para las propiedades
export type Seccion = '1ª' | '2ª' | '3ª';
export type Lado = 'Frontal' | 'Trasera';
export type TipoDocumento = 'NIF' | 'NIE';

// Interfaz para el tipo de registro civil
export interface RegistroCivil {
	id?: number;
	registro: string;
	seccion: Seccion;
	tomo: number;
	numeroPagina: number;
	lado: Lado;
	notasMarginales?: string;
	nombre: string;
	primerApellido: string;
	segundoApellido?: string | null;
	tipoDocumento?: TipoDocumento | null;
	documento?: string | null;
	fecha?: Date | null;
	observaciones?: string | null;
	urlPDF?: string | null;
}

// Estado inicial del registro
const initialRegistro: RegistroCivil = {
	registro: 'xxxx',
	seccion: '1ª',
	tomo: 0,
	numeroPagina: 0,
	lado: 'Frontal',
	nombre: '',
	primerApellido: '',
	urlPDF: null,
};

// Creación del store reactivo para el registro
export const RegistroStore = writable<RegistroCivil>(initialRegistro);

// Métodos para la gestión de registros

// Método para validar los datos del registro
export function validarRegistro(registro: RegistroCivil): void {
	if (!registro.seccion || !['1ª', '2ª', '3ª'].includes(registro.seccion)) {
		throw new Error('La sección debe ser 1ª, 2ª o 3ª.');
	}
	if (!registro.tomo || isNaN(registro.tomo)) {
		throw new Error('El tomo es obligatorio y debe ser un número.');
	}
	if (!registro.numeroPagina || isNaN(registro.numeroPagina)) {
		throw new Error('El número de página es obligatorio y debe ser un número.');
	}
	if (!registro.lado || !['Frontal', 'Trasera'].includes(registro.lado)) {
		throw new Error('El lado debe ser Frontal o Trasera.');
	}
	if (!registro.nombre || typeof registro.nombre !== 'string') {
		throw new Error('El nombre es obligatorio y debe ser una cadena.');
	}
	if (!registro.primerApellido || typeof registro.primerApellido !== 'string') {
		throw new Error('El primer apellido es obligatorio y debe ser una cadena.');
	}
}

// Método para regenerar la clave primaria
export function generarClavePrimaria(registro: RegistroCivil): string {
	return `${registro.seccion}-${registro.tomo}-${registro.numeroPagina}-${registro.lado}`;
}

// Método para convertir un registro en JSON
export function registroToJSON(registro: RegistroCivil): RegistroCivil {
	return { ...registro };
}

// Método para crear un registro desde JSON
export function registroFromJSON(json: Partial<RegistroCivil>): RegistroCivil {
	return {
		...initialRegistro,
		...json,
	};
}

// Función para actualizar el store con un nuevo registro
export function actualizarRegistro(nuevoRegistro: Partial<RegistroCivil>): void {
	RegistroStore.update((registro) => {
		return {
			...registro,
			...nuevoRegistro,
			clavePrimaria: generarClavePrimaria(registro), // Actualiza la clave primaria si cambian los datos relacionados
		};
	});
}
