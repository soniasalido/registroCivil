import type { RequestHandler } from './$types';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file') as File;

	if (!file) {
		return new Response(JSON.stringify({ error: 'No se recibió ningún archivo' }), {
			status: 400
		});
	}

	// Simula la obtención del path completo
	const filePath = path.resolve(process.cwd(), 'uploads', file.name);

	// Devolver el path completo
	return new Response(JSON.stringify({ path: filePath }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
