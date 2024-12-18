<script lang="ts">
	import { writable } from "svelte/store";
	import PdfViewer from '../pdf/PdfViewer.svelte';

	let resultados: any[] = [];
	let error = "";
	let cargando = false;

	// Variables de búsqueda
	let searchBy = "documento"; // Tipo de búsqueda seleccionada
	let seccion = "";
	let tomo = "";
	let pagina = "";
	let lado = "Frontal"; // Opciones: Frontal o Trasera
	let nombre = "";
	let primerApellido = "";
	let segundoApellido = "";

	let registroSeleccionado: any = null; // Registro específico mostrado


	//************************************************************************************************
	// Función para manejar la selección de un registro
	function mostrarRegistro(registro: any) {
		registroSeleccionado = registro;
		console.log("Registro seleccionado:", registro);
	}


	//************************************************************************************************
	// Función para manejar la búsqueda
	async function buscarRegistros() {
		cargando = true;
		error = "";
		resultados = [];

		// Construye el cuerpo de la solicitud basado en el tipo de búsqueda
		const body = searchBy === "documento"
			? { seccion, tomo: parseInt(tomo) || 0, pagina: parseInt(pagina) || 0, lado }
			: { nombre, primerApellido, segundoApellido };

		console.log("Enviando solicitud con cuerpo:", body);

		try {
			const response = await fetch("/api/registros/buscar", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			resultados = data.registros || [];
			console.log("Resultados obtenidos:", resultados);
		} catch (err) {
			error = `Error al buscar registros: ${(err as Error).message}`;
			console.error("Error en la búsqueda:", err);
		} finally {
			cargando = false;
		}
	}

	//************************************************************************************************
	// Función para realizar la búsqueda
	const handleSearch = () => {
		const params =
			searchBy === "documento"
				? { seccion, tomo, pagina, lado }
				: { nombre, primerApellido, segundoApellido };

		if (typeof onSearch === "function") {
			// Envía los parámetros al componente padre
			onSearch(params);
		} else {
			console.warn("onSearch no está definido o no es una función.");
		}

		// Realiza la búsqueda en el servidor
		buscarRegistros();
	};

</script>

<main>
	<!-- Selección del tipo de búsqueda -->
	<label>
		<input
			type="radio"
			name="searchBy"
			value="documento"
			bind:group={searchBy}
		/>
		Por Sección, Tomo, Página y Lado
	</label>


	<label>
		<input
			type="radio"
			name="searchBy"
			value="nombre"
			bind:group={searchBy}
		/>
		Por Nombre y Apellidos
	</label>

	<!-- Formulario de búsqueda -->
	{#if searchBy === "documento"}
		<div class="form">
			<label>
				Sección:
				<input type="text" bind:value={seccion} placeholder="Ej: 1ª" />
			</label>
			<label>
				Tomo:
				<input type="number" bind:value={tomo} placeholder="Ej: 123" />
			</label>
			<label>
				Página:
				<input
					type="number"
					bind:value={pagina}
					placeholder="Ej: 45"
				/>
			</label>
			<label>
				Lado:
				<select bind:value={lado}>
					<option value="Frontal">Frontal</option>
					<option value="Trasera">Trasera</option>
				</select>
			</label>
		</div>
	{:else}
		<div class="form">
			<label>
				Nombre:
				<input
					type="text"
					bind:value={nombre}
					placeholder="Ej: Juan"
				/>
			</label>
			<label>
				Primer Apellido:
				<input
					type="text"
					bind:value={primerApellido}
					placeholder="Ej: Pérez"
				/>
			</label>
			<label>
				Segundo Apellido:
				<input
					type="text"
					bind:value={segundoApellido}
					placeholder="Ej: García"
				/>
			</label>
		</div>
	{/if}

	<!-- Botón de búsqueda -->
	<button on:click={handleSearch} class="search-button">Buscar</button>


	<!-- Resultados -->
	<!-- Tabla de Resultados -->
	{#if resultados.length > 0}
		<table>
			<thead>
			<tr>
				<th>ID</th>
				<th>Nombre</th>
				<th>Primer Apellido</th>
				<th>Segundo Apellido</th>
				<th>Acción</th>
			</tr>
			</thead>
			<tbody>
			{#each resultados as registro}
				<tr>
					<td>{registro.id}</td>
					<td>{registro.nombre}</td>
					<td>{registro.primerApellido}</td>
					<td>{registro.segundoApellido}</td>
					<td>
						<button on:click={() => mostrarRegistro(registro)}>Mostrar</button>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>
	{/if}

	<!-- Registro Seleccionado -->
	{#if registroSeleccionado}
		<hr />
		<h3>Registro Seleccionado:</h3>
		<pre>{JSON.stringify(registroSeleccionado, null, 2)}</pre>
		<h2>Ver documento adjuntado ⇨</h2>
		<PdfViewer file={ registroSeleccionado.urlPDF } />
	{/if}

	<!-- Mensajes de error -->
	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if !cargando && resultados.length === 0 && !error}
		<p>No se encontraron resultados.</p>
	{/if}
</main>

<style>
    main {
        max-width: 600px;
        margin: auto;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    h2 {
        text-align: center;
    }

    .form {
        margin-top: 1rem;
        display: grid;
        gap: 0.5rem;
    }

    label {
        display: flex;
        flex-direction: column;
        font-weight: bold;
    }

    input,
    select {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .search-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
    }

    .search-button:hover {
        background-color: #0056b3;
    }
</style>
