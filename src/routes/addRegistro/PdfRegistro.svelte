<script lang="ts">
	import { RegistroStore } from '../../core/store/registroStore';
	import PdfViewer from './PdfViewer.svelte';


	let pdfFile: File | null = null;

	// Maneja el cambio del archivo
	const handleFileChange = async (event: Event) => {
		const target = event.target as HTMLInputElement;

		if (target.files && target.files.length > 0) {
			pdfFile = target.files[0];

			// Valida el tipo de archivo
			if (pdfFile.type !== 'application/pdf') {
				alert('Por favor, selecciona un archivo PDF.');
				pdfFile = null;
				RegistroStore.update(store => ({ ...store, urlPDF: null }));
				return;
			}

			// Envía el archivo al backend para obtener el path completo
			const formData = new FormData();
			formData.append('file', pdfFile);

			try {
				const response = await fetch('/api/get-pdf-path', {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					throw new Error('Error al obtener el path del archivo');
				}

				const data = await response.json();
				RegistroStore.update(store => ({ ...store, urlPDF: data.path }));
			} catch (err) {
				console.error('Error:', err);
				RegistroStore.update(store => ({ ...store, urlPDF: null }));
			}
		}
	};
</script>

<main>
	<label for="pdfInput" class="button">Seleccionar PDF</label>
	<input id="pdfInput" type="file" accept=".pdf" on:change={handleFileChange} style="display: none;" />


	{#if $RegistroStore.urlPDF}
		<h2>Path del documento ⇨</h2>
		<p>{$RegistroStore.urlPDF}</p>
	{/if}

	<hr />
	{#if pdfFile}
		<h2>Ver documento adjuntado ⇨</h2>
		<PdfViewer file={pdfFile} />
		<hr />
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
