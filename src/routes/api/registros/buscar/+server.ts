import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
	try {
		const { nombre, primerApellido, segundoApellido } = await request.json();

		const registros = await prisma.registroCivil.findMany({
			where: {
				nombre: { contains: nombre, mode: 'insensitive' },
				primerApellido: { contains: primerApellido, mode: 'insensitive' },
				segundoApellido: { contains: segundoApellido, mode: 'insensitive' }
			}
		});

		return json({ registros });
	} catch (error) {
		return json({ error: 'Error buscando registros' }, { status: 500 });
	}
}
