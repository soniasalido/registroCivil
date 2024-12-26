import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';

const prisma = new PrismaClient();

export async function GET() {
	try {
		const registros = await prisma.registroCivil.findMany();
		return json({ registros });
	} catch (error) {
		return json({ error: 'Error fetching records' }, { status: 500 });
	}
}



export async function POST({ request }: { request: Request }) {
	try {
		const data = await request.json();

		// Validación de los campos y generación de clavePrimaria
		if (!['1ª', '2ª', '3ª'].includes(data.seccion)) {
			throw new Error('La sección debe ser 1ª, 2ª o 3ª.');
		}
		if (!['Frontal', 'Trasera'].includes(data.lado)) {
			throw new Error('El lado debe ser Frontal o Trasera.');
		}

		const clavePrimaria = `${data.seccion}-${data.tomo}-${data.numeroPagina}-${data.lado}`;

		const registro = await prisma.registroCivil.create({
			data: {
				...data,
				clavePrimaria,
			},
		});
		console.log('Registro creado:', registro);
		return json({ registro });
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}




export async function PUT({ request }: { request: Request }) {
	try {
		const { id, ...data } = await request.json();
		const registro = await prisma.registroCivil.update({
			where: { id },
			data,
		});
		return json({ registro });
	} catch (error) {
		return json({ error: 'Error updating record' }, { status: 500 });
	}
}

export async function DELETE({ request }: { request: Request }) {
	try {
		const { id } = await request.json();
		await prisma.registroCivil.delete({
			where: { id },
		});
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Error deleting record' }, { status: 500 });
	}
}
