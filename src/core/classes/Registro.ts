
// import fs from 'fs';
// import path from 'path';

/*
No voy a usar las clases de este archivo, pero las dejo aquí por si las necesito en el futuro.
Voy a usar stores de Svelte para gestionar los datos de los registros.
 */

type Seccion = '1ª' | '2ª' | '3ª';
type Lado = 'Frontal' | 'Trasera';
type TipoDocumento = 'NIF' | 'NIE';

interface RegistroCivilProps {
	id?: number;	  // Opcional antes de guardar, obligatorio después
	registro?: string;
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

export class RegistroCivil {
	id: number | undefined;  	// Opcional al crear, obligatorio después de guardar
	clavePrimaria: string;
	registro: string;
	seccion: Seccion;
	tomo: number;
	numeroPagina: number;
	lado: Lado;
	notasMarginales: string;
	nombre: string;
	primerApellido: string;
	segundoApellido: string | null;
	tipoDocumento: TipoDocumento | null;
	documento: string | null;
	fecha: Date | null;
	observaciones: string | null;
	urlPDF: string | null;

	constructor({
								id,
								registro = 'xxxx',
								seccion,
								tomo,
								numeroPagina,
								lado,
								notasMarginales = '1',
								nombre,
								primerApellido,
								segundoApellido = null,
								tipoDocumento = null,
								documento = null,
								fecha = null,
								observaciones = null,
								urlPDF = null,
							}: RegistroCivilProps) {
		this.id = id;
		this.clavePrimaria = `${seccion}-${tomo}-${numeroPagina}-${lado}`;
		this.registro = registro;
		this.seccion = seccion;
		this.tomo = tomo;
		this.numeroPagina = numeroPagina;
		this.lado = lado;
		this.notasMarginales = notasMarginales;
		this.nombre = nombre;
		this.primerApellido = primerApellido;
		this.segundoApellido = segundoApellido;
		this.tipoDocumento = tipoDocumento;
		this.documento = documento;
		this.fecha = fecha;
		this.observaciones = observaciones;
		this.urlPDF = urlPDF;

	}

	// Método para validar los datos del registro
	validarRegistro(): void {
		if (!this.seccion || !['1ª', '2ª', '3ª'].includes(this.seccion)) {
			throw new Error('La sección debe ser 1ª, 2ª o 3ª.');
		}
		if (!this.tomo || isNaN(this.tomo)) {
			throw new Error('El tomo es obligatorio y debe ser un número.');
		}
		if (!this.numeroPagina || isNaN(this.numeroPagina)) {
			throw new Error('El número de página es obligatorio y debe ser un número.');
		}
		if (!this.lado || !['Frontal', 'Trasera'].includes(this.lado)) {
			throw new Error('El lado debe ser Frontal o Trasera.');
		}
		if (!this.nombre || typeof this.nombre !== 'string') {
			throw new Error('El nombre es obligatorio y debe ser una cadena.');
		}
		if (!this.primerApellido || typeof this.primerApellido !== 'string') {
			throw new Error('El primer apellido es obligatorio y debe ser una cadena.');
		}
	}

	// Método para regenerar la clave primaria
	generarClavePrimaria(): void {
		this.clavePrimaria = `${this.seccion}-${this.tomo}-${this.numeroPagina}-${this.lado}`;
	}

	// Método para convertir la instancia en JSON
	toJSON(): RegistroCivilProps {
		return {
			id: this.id,
			registro: this.registro,
			seccion: this.seccion,
			tomo: this.tomo,
			numeroPagina: this.numeroPagina,
			lado: this.lado,
			notasMarginales: this.notasMarginales,
			nombre: this.nombre,
			primerApellido: this.primerApellido,
			segundoApellido: this.segundoApellido,
			tipoDocumento: this.tipoDocumento,
			documento: this.documento,
			fecha: this.fecha,
			observaciones: this.observaciones,
			urlPDF: this.urlPDF,
		};
	}


	// Método para crear una instancia desde un objeto JSON
	static fromJSON(json: RegistroCivilProps): RegistroCivil {
		return new RegistroCivil(json);
	}

}
