<script lang="ts">

	import { onDestroy } from 'svelte';

	import { onMount } from 'svelte';


	export let file: File | null = null;

	let fileURL: string | null = null;


	// Reactividad: Actualiza fileURL cuando file cambia
	$: {
		if (file) {
			if (fileURL) URL.revokeObjectURL(fileURL); // Limpia el objeto anterior
			fileURL = URL.createObjectURL(file); // Crea nuevo objeto URL
		} else {
			fileURL = null; // Si no hay archivo, resetea
		}
	}

	// Limpieza del objeto URL cuando el componente se desmonta
	onDestroy(() => {
		if (fileURL) {
			URL.revokeObjectURL(fileURL);
		}

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
	});

</script>

<main>
	{#if file}

		<button type="button" class="button" on:click={openInNewTab}>
			Abrir PDF
		</button>
	{:else}
		<p>No hay archivo seleccionado.</p>

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


    p {
        font-size: 1rem;
        color: #666;
    }

</style>
