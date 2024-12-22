import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function POST({ request }: { request: Request }) {
	try {
		const { nombre, primerApellido, segundoApellido, seccion, tomo, pagina, lado } = await request.json();

		if (!(nombre || primerApellido || segundoApellido || seccion || tomo || pagina || lado)) {
			return json({ error: 'Se requiere al menos un parámetro de búsqueda' }, { status: 400 });
		}

		const registros = await prisma.registroCivil.findMany({
			where: {
				AND: [
					// Búsqueda por nombre y apellidos
					nombre ? { nombre: { contains: nombre.toLowerCase() } } : {},
					primerApellido ? { primerApellido: { contains: primerApellido.toUpperCase() } } : {},
					segundoApellido ? { segundoApellido: { contains: segundoApellido.toUpperCase() } } : {},
					// Búsqueda por sección, tomo, página y lado
					seccion ? { seccion: { equals: seccion } } : {},
					tomo ? { tomo: parseInt(tomo) } : {},
					pagina ? { numeroPagina: parseInt(pagina) } : {},
					lado ? { lado: { equals: lado } } : {},
				],
			},
		});

		return json({ registros });
	} catch (error) {
		console.error('Error en la búsqueda:', error);
		return json({ error: 'Error buscando registros' }, { status: 500 });
	}
}
