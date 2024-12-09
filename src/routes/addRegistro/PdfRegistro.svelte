<script lang="ts">
	let pdfFile: File | null = null; // Archivo seleccionado
	let pdfUrl: string = ''; // Nombre o vista previa del archivo seleccionado

	// Maneja el cambio del archivo en el input
	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			pdfFile = target.files[0]; // Obtiene el archivo seleccionado
			if (pdfFile.type !== 'application/pdf') {
				alert('Por favor, selecciona un archivo PDF.');
				pdfFile = null;
				pdfUrl = '';
				return;
			}
			pdfUrl = pdfFile.name; // Muestra el nombre del archivo seleccionado
		}
	};
</script>

<main>
	<label for="pdfInput" class="button">Seleccionar PDF</label>
	<input id="pdfInput" type="file" accept=".pdf" on:change={handleFileChange} style="display: none;" />

	{#if pdfUrl}
		<p>Archivo seleccionado: {pdfUrl}</p>
	{/if}
</main>

<style>
    .button {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
    }

    .button:hover {
        background-color: #0056b3;
    }

    p {
        margin-top: 1rem;
        font-size: 0.9rem;
    }
</style>
