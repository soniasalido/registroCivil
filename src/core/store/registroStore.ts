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
	registro: '18657',
	seccion: '1ª',
	tomo: 0,
	numeroPagina: 0,
	lado: 'Frontal',
	nombre: '',
	primerApellido: '',
	urlPDF: null,
};

// Creación del store reactivo para el registro
const { subscribe, update, set } = writable<RegistroCivil>(initialRegistro);

// Función `get` para obtener el estado actual del store
function get() {
	let currentValue: RegistroCivil;
	const unsubscribe = subscribe((value) => {
		currentValue = value;
	});
	unsubscribe(); // Desuscribirse inmediatamente después de obtener el valor
	return currentValue!;
}

//Función para restablecer el estado inicial del store
export const resetRegistroStore = () => {
	set({ ...initialRegistro });
}


// Función para obtener un registro por ID desde el backend
export async function obtenerRegistroPorId(id: number): Promise<RegistroCivil | null> {
	try {
		const response = await fetch(`/api/registros/${id}`);
		if (!response.ok) throw new Error('Error al obtener el registro');
		const data: RegistroCivil = await response.json();
		RegistroStore.set(data); // Actualiza el store con los datos obtenidos
		return data;
	} catch (error) {
		console.error('Error al obtener registro:', error);
		return null;
	}
}

// Función para guardar cambios en un registro
export async function guardarCambiosRegistro(registro: RegistroCivil): Promise<boolean> {
	try {
		const response = await fetch(`/api/registros/${registro.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(registro),
		});
		if (!response.ok) throw new Error('Error al guardar los cambios');
		const updatedRegistro = await response.json();
		set(updatedRegistro); // Actualiza el store con los datos modificados
		return true;
	} catch (error) {
		console.error('Error al guardar cambios del registro:', error);
		return false;
	}
}



// Exportar el store con los métodos adicionales
export const RegistroStore = {
	subscribe,
	update,
	set,
	get,
	reset: resetRegistroStore,
};

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
// export function registroFromJSON(json: Partial<RegistroCivil>): RegistroCivil {
// 	return {
// 		...initialRegistro,
// 		...json,
// 	};
// }

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

// Función para buscar registros en la base de datos
export async function buscarRegistro(criteria: Partial<RegistroCivil>) {
	try {
		const {
			seccion,
			tomo,
			numeroPagina,
			lado,
			nombre,
			primerApellido,
			segundoApellido,
		} = criteria;

		// Crear filtros dinámicos
		const where = {};
		if (seccion) where['seccion'] = seccion;
		if (tomo) where['tomo'] = tomo;
		if (numeroPagina) where['numeroPagina'] = numeroPagina;
		if (lado) where['lado'] = lado;
		if (nombre) where['nombre'] = { contains: nombre, mode: 'insensitive' };
		if (primerApellido) where['primerApellido'] = { contains: primerApellido, mode: 'insensitive' };
		if (segundoApellido) where['segundoApellido'] = { contains: segundoApellido, mode: 'insensitive' };

		// Consultar la base de datos con Prisma
		const registros = await prisma.registro.findMany({
			where,
		});

		return registros;
	} catch (error) {
		console.error('Error al buscar registros:', error);
		throw new Error('No se pudo realizar la búsqueda');
	}
}
