import { writable } from 'svelte/store';

// Tipo para el registro civil
export interface RegistroCivil {
	id?: number;
	registro: string;
	seccion: string;
	tomo: number;
	numeroPagina: number;
	lado: string;
	notasMarginales?: string;
	nombre: string;
	primerApellido: string;
	segundoApellido?: string | null;
	tipoDocumento?: string | null;
	documento?: string | null;
	fecha?: string | null;
	observaciones?: string | null;
	urlPDF?: string | null;
}

// Store para gestionar los registros
export const RegistroStore = writable<RegistroCivil>({
	registro: 'xxxx',
	seccion: '1ª',
	tomo: 0,
	numeroPagina: 0,
	lado: 'Frontal',
	nombre: '',
	primerApellido: '',
	urlPDF: '',
});
