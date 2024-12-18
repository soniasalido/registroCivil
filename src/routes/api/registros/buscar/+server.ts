import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
	try {
		const { nombre = '', primerApellido = '', segundoApellido = '' } = await request.json();

		if (!nombre && !primerApellido && !segundoApellido) {
			return json({ error: 'Se requiere al menos un parámetro de búsqueda' }, { status: 400 });
		}

		const registros = await prisma.registroCivil.findMany({
			where: {
				AND: [
					nombre ? { nombre: { contains: nombre.toLowerCase() } } : {},
					primerApellido ? { primerApellido: { contains: primerApellido.toUpperCase() } } : {},
					segundoApellido ? { segundoApellido: { contains: segundoApellido.toUpperCase() } } : {},
				],
			},
		});

		return json({ registros });
	} catch (error) {
		console.error('Error en la búsqueda:', error);
		return json({ error: 'Error buscando registros' }, { status: 500 });
	}
}
