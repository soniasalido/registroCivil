import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
	try {
<<<<<<< HEAD
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
=======
		const { nombre, primerApellido, segundoApellido } = await request.json();

		const registros = await prisma.registroCivil.findMany({
			where: {
				nombre: { contains: nombre, mode: 'insensitive' },
				primerApellido: { contains: primerApellido, mode: 'insensitive' },
				segundoApellido: { contains: segundoApellido, mode: 'insensitive' }
			}
>>>>>>> d1e09a3e3969144d4cbc0280a84df13296fdb8f9
		});

		return json({ registros });
	} catch (error) {
<<<<<<< HEAD
		console.error('Error en la búsqueda:', error);
=======
>>>>>>> d1e09a3e3969144d4cbc0280a84df13296fdb8f9
		return json({ error: 'Error buscando registros' }, { status: 500 });
	}
}
