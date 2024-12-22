<script lang="ts">
	import { RegistroStore, guardarCambiosRegistro } from '../../core/store/registroStore';

	let error: string | null = null;
	let success: string | null = null;

	// Suscripción reactiva al store
	let registro;
	RegistroStore.subscribe((value) => {
		registro = value;
	});


	console.log("Contenido del store.......:", registro);

	// Función para guardar los cambios
	const guardarCambios = async () => {
		success = null;
		error = null;

		try {
			const response = await fetch('/api/registros', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(registro),
			});

			if (!response.ok) {
				throw new Error(`Error al guardar los cambios: ${response.statusText}`);
			}

			const data = await response.json();

			// Actualizar el registro en el store con la respuesta del servidor
			RegistroStore.set(data);

			success = 'Registro actualizado correctamente.';
			alert('Registro actualizado correctamente.');

			// Redirigir a la página de inicio
			window.location.href = '/findRegistro';
		} catch (err) {
			error = (err as Error).message || 'Ocurrió un error al guardar los cambios.';
		}
	};
</script>

<main>
	<h1>Modificar Registro</h1>
	{#if error}
		<p class="error">{error}</p>
	{:else if success}
		<p class="success">{success}</p>
	{:else}
		<form on:submit|preventDefault={guardarCambios}>
			<label>
				Registro:
				<input type="text" bind:value={registro.registro} />
			</label>
			<label>
				Sección:
				<select bind:value={registro.seccion}>
					<option value="1ª">1ª</option>
					<option value="2ª">2ª</option>
					<option value="3ª">3ª</option>
				</select>
			</label>
			<label>
				Tomo:
				<input type="number" bind:value={registro.tomo} />
			</label>
			<label>
				Número de Página:
				<input type="number" bind:value={registro.numeroPagina} />
			</label>
			<label>
				Lado:
				<select bind:value={registro.lado}>
					<option value="Frontal">Frontal</option>
					<option value="Trasera">Trasera</option>
				</select>
			</label>
			<label>
				Nombre:
				<input type="text" bind:value={registro.nombre} />
			</label>
			<label>
				Primer Apellido:
				<input type="text" bind:value={registro.primerApellido} />
			</label>
			<label>
				Segundo Apellido:
				<input type="text" bind:value={registro.segundoApellido} />
			</label>
			<label>
				URL PDF:
				<input type="text" bind:value={registro.urlPDF} />
			</label>
			<button type="submit">Guardar Cambios</button>
		</form>
	{/if}
</main>

<style>
    main {
        max-width: 600px;
        margin: auto;
        padding: 1rem;
    }
    .error {
        color: red;
    }
    .success {
        color: green;
    }
    label {
        display: block;
        margin-bottom: 1rem;
    }
    input, select, button {
        display: block;
        width: 100%;
        margin-top: 0.5rem;
        padding: 0.5rem;
    }
    button {
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
</style>
