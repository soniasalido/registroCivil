<script lang="ts">
	import { RegistroStore, validarRegistro, actualizarRegistro } from '../../core/store/registroStore';
	import PdfRegistro from './PdfRegistro.svelte';
	import { get } from 'svelte/store';

	let error: string | null = null;
	let success: string | null = null;

	// Actualizar la URL del PDF desde el componente PdfRegistro
	const handleUpdatePdfUrl = (event: CustomEvent<string>) => {
		actualizarRegistro({ urlPDF: event.detail }); // Actualiza la URL del PDF en el store
	};

	// Maneja el envío del formulario
	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		error = null;
		success = null;

		try {
			const registro = get(RegistroStore); // Obtiene el estado actual del store
			validarRegistro(registro); // Valida los datos


			// Convertir fecha al formato ISO 8601 si existe
			if (registro.fecha) {
				registro.fecha = new Date(registro.fecha).toISOString();
			}



			// Enviar datos al backend
			const response = await fetch('/api/registros', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(registro),
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			success = 'Registro añadido correctamente.';
			// Limpiar el formulario reseteando el store
			RegistroStore.set({
				registro: 'xxxx',
				seccion: '1ª',
				tomo: 0,
				numeroPagina: 0,
				lado: 'Frontal',
				nombre: '',
				primerApellido: '',
				segundoApellido: null,
				tipoDocumento: null,
				documento: null,
				fecha: null,
				observaciones: null,
				urlPDF: null
			});
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
		<select id="seccion" bind:value={$RegistroStore.seccion}>
			<option value="1ª">1ª</option>
			<option value="2ª">2ª</option>
			<option value="3ª">3ª</option>
		</select>

		<label for="tomo">Tomo</label>
		<input type="number" id="tomo" bind:value={$RegistroStore.tomo} min="0" required />

		<label for="numeroPagina">Número de Página</label>
		<input type="number" id="numeroPagina" bind:value={$RegistroStore.numeroPagina} min="0" required />

		<label for="lado">Lado</label>
		<select id="lado" bind:value={$RegistroStore.lado}>
			<option value="Frontal">Frontal</option>
			<option value="Trasera">Trasera</option>
		</select>

		<label for="nombre">Nombre</label>
		<input type="text" id="nombre" bind:value={$RegistroStore.nombre} required />

		<label for="primerApellido">Primer Apellido</label>
		<input type="text" id="primerApellido" bind:value={$RegistroStore.primerApellido} required />

		<label for="segundoApellido">Segundo Apellido</label>
		<input type="text" id="segundoApellido" bind:value={$RegistroStore.segundoApellido} />

		<label for="tipoDocumento">Tipo de Documento</label>
		<select id="tipoDocumento" bind:value={$RegistroStore.tipoDocumento}>
			<option value="">-- Seleccione --</option>
			<option value="NIF">NIF</option>
			<option value="NIE">NIE</option>
		</select>

		<label for="documento">Documento</label>
		<input type="text" id="documento" bind:value={$RegistroStore.documento} />

		<label for="fecha">Fecha</label>
		<input type="date" id="fecha" bind:value={$RegistroStore.fecha} />

		<label for="observaciones">Observaciones</label>
		<textarea id="observaciones" bind:value={$RegistroStore.observaciones}></textarea>

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
    .success {
        color: green;
        margin-bottom: 1rem;
    }
</style>
