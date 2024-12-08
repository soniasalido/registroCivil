<script lang="ts">
	import { onMount } from 'svelte';

	let registros = [];

	async function fetchRegistros() {
		const response = await fetch('/api/registros');
		const data = await response.json();
		registros = data.registros;
	}

	onMount(fetchRegistros);
</script>

<main>
	<h1>Registros Civiles</h1>
	<ul>
		{#each registros as registro}
			<li>{registro.nombre} {registro.primerApellido}</li>
		{/each}
	</ul>
</main>
