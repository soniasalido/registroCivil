<script lang="ts">
	import PdfViewer from './PdfViewer.svelte';
	import { RegistroStore } from '../../core/store/registroStore';
	import ModificarRegistro from '../modificar/ModificarRegistro.svelte';

	let resultados: any[] = [];
	let error = "";
	let cargando = false;
	let mostrarModificar = false;



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
		mostrarModificar = false;

		// Actualizar el store globalmente con el registro seleccionado
		RegistroStore.set({
			...registro, // Copiar los valores del registro seleccionado
		});

		// Obtiene el contenido del store y lo muestra en consola
		console.log("Contenido del storexxx------------:", registro);
	}


	//************************************************************************************************
	// Función para manejar la búsqueda
	// Función para manejar la búsqueda
	async function buscarRegistros() {
		cargando = true;
		error = "";
		resultados = [];

		const body = searchBy === "documento"
			? { seccion, tomo: parseInt(tomo) || 0, pagina: parseInt(pagina) || 0, lado }
			: { nombre, primerApellido, segundoApellido };

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
		} catch (err) {
			error = `Error al buscar registros: ${(err as Error).message}`;
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

	//************************************************************************************************
	// Función para modificar un registro
	const modificarRegistro = () => {
		mostrarModificar = true;
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
			<label for="seccion">Sección:</label>
			<select id="seccion" bind:value={seccion}>
				<option value="1ª">1ª</option>
				<option value="2ª">2ª</option>
				<option value="3ª">3ª</option>
			</select>


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
	<button onclick={handleSearch} class="search-button">Buscar</button>


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
						<button class="search-button" onclick={() => mostrarRegistro(registro)}>Seleccionar</button>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>
	{/if}

	<!-- Registro Seleccionado -->
	{#if registroSeleccionado}
		<hr />
		<h2><strong>Registro Seleccionado:</strong></h2>
<!--		<pre>{JSON.stringify($RegistroStore, null, 2)}</pre>-->
		<p>ID: { $RegistroStore.id }</p>
		<p>Clave Primaria: { RegistroStore.clavePrimaria }</p>
		<p>Sección { $RegistroStore.seccion }</p>
		<p>Tomo: { $RegistroStore.tomo }</p>
		<p>Número de Página: { $RegistroStore.numeroPagina }</p>
		<p>Lado: { $RegistroStore.lado }</p>
		<p>Nombre: { $RegistroStore.nombre }</p>
		<p>Primer Apellido: { $RegistroStore.primerApellido }</p>
		<p>Segundo Apellido: { $RegistroStore.segundoApellido }</p>
		<p>Tipo de Documento: { $RegistroStore.tipoDocumento }</p>
		<p>Documento: { $RegistroStore.documento }</p>
		<p>Fecha: { $RegistroStore.fecha }</p>
		<p>Observaciones: { $RegistroStore.observaciones }</p>
<!--		<p>URL PDF: { $RegistroStore.urlPDF }</p>-->

		<h2>Documento adjuntado ⇨</h2>
		<PdfViewer url={$RegistroStore.urlPDF} />
		<button class="modify-button" onclick={modificarRegistro}>Modificar</button>
	{/if}


	<!-- Muestra el componente modificarRegistro -->
	{#if mostrarModificar}
		<ModificarRegistro />
	{/if}


	<!-- Mensajes de error -->
	{#if error}
		<p class="error">{error}</p>
	{/if}

	<!--{#if !cargando && resultados.length === 0 && !error}-->
	<!--	<p>No se encontraron resultados.</p>-->
	<!--{/if}-->
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

    table {
        border-collapse: collapse; /* Combina los bordes */
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        border: 2px solid #333; /* Borde de la tabla */
    }

    th, td {
        border: 1px solid #333; /* Bordes de las celdas */
        padding: 10px;
        text-align: center;
    }

    th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    .modify-button {
        background-color: #bd0d0d; /* Rojo */
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
    }

    .modify-button:hover {
        background-color: #fb4040; /* Rojo más oscuro al pasar el cursor */
    }

    .modify-button:active {
        background-color: #cc0000; /* Rojo aún más oscuro al hacer clic */
    }
</style>
