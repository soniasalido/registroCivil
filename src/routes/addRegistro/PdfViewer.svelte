<script lang="ts">
	import { onMount } from 'svelte';

	export let file: File | null = null;

	let fileURL: string | null = null;

	// Crear una URL de objeto para el archivo PDF y limpiarla al desmontar
	onMount(() => {
		if (file) {
			fileURL = URL.createObjectURL(file);
		}

		return () => {
			if (fileURL) {
				URL.revokeObjectURL(fileURL);
			}
		};
	});

	const openInNewTab = () => {
		if (fileURL) {
			// Abre la URL en una nueva pestaña
			window.open(fileURL, '_blank', 'noopener,noreferrer');
		}
	};
</script>

<main>
	{#if file}
		<button type="button" class="button" on:click={openInNewTab}>Abrir PDF</button>
	{/if}
</main>

<style>
    .button {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
    }

    .button:hover {
        background-color: #218838;
    }
</style>
