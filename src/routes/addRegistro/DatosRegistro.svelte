<script lang="ts">
 	import { RegistroCivil } from '../../core/classes/Registro';
	import PdfRegistro from './PdfRegistro.svelte';

	// Crear un nuevo registro civil con valores iniciales
	let registroCivil = new RegistroCivil({
		seccion: '1ª',
		tomo: 0,
		numeroPagina: 0,
		lado: 'Frontal',
		nombre: '',
		primerApellido: '',
		urlPDF: '', // Inicialmente sin ruta de PDF
	});

	let error: string | null = null;
	let success: string | null = null;

	// Actualizar la URL del PDF desde el evento del componente PdfRegistro
	const handleUpdatePdfUrl = (event: CustomEvent<string>) => {
		registroCivil.urlPDF = event.detail; // Actualiza el campo urlPDF del registro
	};


	// Maneja el envío del formulario
	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		error = null;
		success = null;

		try {
			registroCivil.validarRegistro();

			const registroData = registroCivil.toJSON();

			// Convertir fecha al formato ISO 8601 si existe
			if (registroData.fecha) {
				registroData.fecha = new Date(registroData.fecha).toISOString();
			}

			// Enviar datos al backend
			const response = await fetch('/api/registros', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(registroData),
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			success = 'Registro añadido correctamente.';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error desconocido';
		}
	};
</script>


<main>
	<form on:submit|preventDefault={handleSubmit}>
		{#if error}
			<div class="error">{error}</div>
		{/if}
		{#if success}
			<div class="success">{success}</div>
		{/if}

		<!-- Campos del formulario -->
		<label for="seccion">Sección</label>
		<select id="seccion" bind:value={registroCivil.seccion}>
			<option value="1ª">1ª</option>
			<option value="2ª">2ª</option>
			<option value="3ª">3ª</option>
		</select>

		<label for="tomo">Tomo</label>
		<input type="number" id="tomo" bind:value={registroCivil.tomo} min="0" required />

		<label for="numeroPagina">Número de Página</label>
		<input type="number" id="numeroPagina" bind:value={registroCivil.numeroPagina} min="0" required />

		<label for="lado">Lado</label>
		<select id="lado" bind:value={registroCivil.lado}>
			<option value="Frontal">Frontal</option>
			<option value="Trasera">Trasera</option>
		</select>

		<label for="nombre">Nombre</label>
		<input type="text" id="nombre" bind:value={registroCivil.nombre} required />

		<label for="primerApellido">Primer Apellido</label>
		<input type="text" id="primerApellido" bind:value={registroCivil.primerApellido} required />

		<label for="segundoApellido">Segundo Apellido</label>
		<input type="text" id="segundoApellido" bind:value={registroCivil.segundoApellido} />

		<label for="tipoDocumento">Tipo de Documento</label>
		<select id="tipoDocumento" bind:value={registroCivil.tipoDocumento}>
			<option value="">-- Seleccione --</option>
			<option value="NIF">NIF</option>
			<option value="NIE">NIE</option>
		</select>

		<label for="documento">Documento</label>
		<input type="text" id="documento" bind:value={registroCivil.documento} />

		<label for="fecha">Fecha</label>
		<input type="date" id="fecha" bind:value={registroCivil.fecha} />

		<label for="observaciones">Observaciones</label>
		<textarea id="observaciones" bind:value={registroCivil.observaciones}></textarea>

		<!-- Componente PDF -->
		<PdfRegistro on:updatePdfUrl={handleUpdatePdfUrl} />

		<button type="submit"><strong>Añadir Registro</strong></button>
	</form>

</main>

<style>
    form {
        max-width: 600px;
        margin: auto;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }
    label {
        display: block;
        margin: 0.5rem 0 0.25rem;
        font-weight: bold;
    }
    input, select, textarea {
        width: 100%;
        padding: 0.5rem;
        margin-bottom: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    button {
        display: block;
        width: 100%;
        padding: 0.75rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
    .error {
        color: red;
        margin-bottom: 1rem;
    }
</style>
