
<script lang="ts">
	import { Footer, Header, NavFindRegistro } from '$lib';

	import FindRegistroForm from './FindRegistroForm.svelte';


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

</script>


<main class="card">
	<Header />
	<h2>Buscar Registro</h2>

	<FindRegistroForm />



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
