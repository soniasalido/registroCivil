<script lang="ts">
	import { onMount } from 'svelte';

	let pdfDoc: any;
	let pageNum = 1;
	let totalPages: number;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	// Obtener la ubicación del archivo PDF desde el store
	// Uso de la runa $props para recibir las propiedades
	let { urlPDF } = $props();

	const clearCanvas = () => {
		if (canvas) {
			ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			canvas.width = 0;
			canvas.height = 0;
		}
	};

	const loadPdf = async () => {
		const pdfjsLib = await import('pdfjs-dist/webpack');
		pdfjsLib.GlobalWorkerOptions.workerSrc =
			'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

		try {
			pdfDoc = await pdfjsLib.getDocument(urlPDF).promise;
			totalPages = pdfDoc.numPages;
			renderPage(pageNum);
		} catch (error) {
			console.error('Error cargando el PDF:', error);
		}
	};

	const renderPage = async (num: number) => {
		if (!pdfDoc) return;

		const page = await pdfDoc.getPage(num);
		const viewport = page.getViewport({ scale: 1 });

		canvas.width = viewport.width;
		canvas.height = viewport.height;
		ctx = canvas.getContext('2d')!;

		const renderContext = {
			canvasContext: ctx,
			viewport,
		};

		await page.render(renderContext).promise;
	};

	const nextPage = (event: Event) => {
		event.preventDefault();
		if (pageNum < totalPages) {
			pageNum++;
			renderPage(pageNum);
		}
	};

	const prevPage = (event: Event) => {
		event.preventDefault();
		if (pageNum > 1) {
			pageNum--;
			renderPage(pageNum);
		}
	};

	// Cargar el PDF cuando la URL esté disponible
	$effect(() => {
		if (urlPDF) {
			pageNum = 1; // Reiniciar a la primera página al cambiar el archivo
			loadPdf();
		}
	});

	// Limpia el lienzo al desmontar el componente
	onMount(() => {
		clearCanvas();
	});
</script>

<div class="pdf-viewer">
	{#if urlPDF}
		<canvas bind:this={canvas}></canvas>
		<div class="controls">
			<button on:click={prevPage} disabled={pageNum === 1}>&laquo; Anterior</button>
			<span>Página {pageNum} de {totalPages}</span>
			<button on:click={nextPage} disabled={pageNum === totalPages}>Siguiente &raquo;</button>
		</div>
	{:else}
		<p>No se ha cargado ningún documento.</p>
	{/if}
</div>

<style>
    .pdf-viewer {
        text-align: center;
        margin: 1rem 0;
    }

    canvas {
        border: 1px solid #ccc;
        max-width: 100%;
    }

    .controls {
        margin-top: 1rem;
    }

    button {
        padding: 0.5rem 1rem;
        margin: 0 0.5rem;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }

    button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
</style>
