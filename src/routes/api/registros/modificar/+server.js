import { json } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { RegistroStore } from '../../../../core/store/registroStore.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Maneja las solicitudes PUT para actualizar un registro tomando el ID desde el store.
 * @param {import('@sveltejs/kit').RequestEvent} event
 */
export async function PUT({ request }) {
	try {
		// Obtener el registro actual desde el store
		const currentRegistro = get(RegistroStore);

		// Validar que el ID está presente en el store
		if (!currentRegistro || !currentRegistro.id) {
			return json({ error: 'No se encontró un registro válido en el store.' }, { status: 400 });
		}

		// Parsear el cuerpo de la solicitud
		const body = await request.json();

		// Actualizar el registro en la base de datos con Prisma
		const updatedRegistro = await prisma.registrocivil.update({
			where: { id: Number(currentRegistro.id) },
			data: {
				registro: body.registro || currentRegistro.registro,
				seccion: body.seccion || currentRegistro.seccion,
				tomo: body.tomo || currentRegistro.tomo,
				numeroPagina: body.numeroPagina || currentRegistro.numeroPagina,
				lado: body.lado || currentRegistro.lado,
				notasMarginales: body.notasMarginales || currentRegistro.notasMarginales,
				nombre: body.nombre || currentRegistro.nombre,
				primerApellido: body.primerApellido || currentRegistro.primerApellido,
				segundoApellido: body.segundoApellido || currentRegistro.segundoApellido,
				tipoDocumento: body.tipoDocumento || currentRegistro.tipoDocumento,
				documento: body.documento || currentRegistro.documento,
				fecha: body.fecha || currentRegistro.fecha,
				observaciones: body.observaciones || currentRegistro.observaciones,
				urlPDF: body.urlPDF || currentRegistro.urlPDF,
				// Añade más campos según sea necesario
			},
		});

		// Actualizar el store con los datos modificados
		RegistroStore.set(updatedRegistro);

		// Responder con el registro actualizado
		return json(updatedRegistro, { status: 200 });
	} catch (error) {
		console.error('Error al actualizar el registro:', error);
		return json({ error: 'No se pudo actualizar el registro', details: error.message }, { status: 500 });
	}
}
