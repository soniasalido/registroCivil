
<script lang="ts">
	import { Footer, Header, NavFindRegistro } from '$lib';
<<<<<<< HEAD
	import FindRegistroForm from './FindRegistroForm.svelte';

=======
	import { onMount } from "svelte";
	let resultados: any[] = [];
	let error = "";
	let cargando = false;

	let searchBy = "documento"; // Tipo de búsqueda seleccionada
	let seccion = "";
	let tomo = "";
	let pagina = "";
	let lado = "Frontal";
	let nombre = "";
	let primerApellido = "";
	let segundoApellido = "";

	// Función para manejar la búsqueda
	async function buscarRegistros() {
		cargando = true;
		error = "";
		resultados = [];


		const body = searchBy === "documento"
			? { seccion, tomo: parseInt(tomo), pagina: parseInt(pagina), lado }
			: { nombre, primerApellido, segundoApellido };

		console.log(body);
		try {
			const response = await fetch("/api/registros/buscar", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

			const data = await response.json();
			resultados = data;
		} catch (err) {
			error = `Error al buscar registros: ${(err as Error).message}`;
		} finally {
			cargando = false;
		}
	}
>>>>>>> d1e09a3e3969144d4cbc0280a84df13296fdb8f9
</script>


<main class="card">
	<Header />
	<h2>Buscar Registro</h2>
	<h2>Buscar Registro</h2>

<<<<<<< HEAD
	<FindRegistroForm />
=======

	<!-- Selección del tipo de búsqueda -->
	<div class="search-type">
		<label>
			<input type="radio" name="searchBy" value="documento" bind:group={searchBy} />
			Por Sección, Tomo, Página y Lado
		</label>
		<label>
			<input type="radio" name="searchBy" value="nombre" bind:group={searchBy} />
			Por Nombre y Apellidos
		</label>
	</div>

	<!-- Formulario de búsqueda -->
	{#if searchBy === "documento"}
		<div class="form">
			<label>Sección: <input type="text" bind:value={seccion} placeholder="Ej: 1ª" /></label>
			<label>Tomo: <input type="number" bind:value={tomo} placeholder="Ej: 123" /></label>
			<label>Página: <input type="number" bind:value={pagina} placeholder="Ej: 45" /></label>
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
			<label>Nombre: <input type="text" bind:value={nombre} placeholder="Ej: Juan" /></label>
			<label>Primer Apellido: <input type="text" bind:value={primerApellido} placeholder="Ej: Pérez" /></label>
			<label>Segundo Apellido: <input type="text" bind:value={segundoApellido} placeholder="Ej: García" /></label>
		</div>
	{/if}

	<!-- Botón de búsqueda -->
	<button on:click={buscarRegistros} disabled={cargando}>
		{cargando ? "Buscando..." : "Buscar"}
	</button>

	<!-- Resultados -->
	{#if error}
		<p class="error">{error}</p>
	{:else if resultados.length > 0}
		<ul class="resultados">
			{#each resultados as registro}
				<li>
					{registro.seccion}, Tomo {registro.tomo}, Página {registro.pagina}, {registro.lado} -
					{registro.nombre} {registro.primerApellido} {registro.segundoApellido}
				</li>
			{/each}
		</ul>
	{:else if !cargando}
		<p>No se encontraron registros.</p>
	{/if}

>>>>>>> d1e09a3e3969144d4cbc0280a84df13296fdb8f9

	<NavFindRegistro />
	<Footer />
</main>


<style>
    .formulario-busqueda {
        margin: 20px;
    }

    .formulario-busqueda label {
        margin-right: 10px;
    }

    .resultados ul {
        list-style-type: none;
        padding: 0;
    }
</style>
