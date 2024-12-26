<script lang="ts">
	import { onMount } from 'svelte';

	let { url } = $props(); // Uso de la runa $props para recibir las propiedades

	let pdfDoc: any;
	let pageNum = 1;
	let totalPages: number;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

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
		if (!url) return;

		// Limpia el lienzo antes de cargar un nuevo PDF
		clearCanvas();

		try {
			// Cargar el archivo PDF usando pdf.js
			const pdfjsLib = await import('pdfjs-dist/webpack');
			pdfjsLib.GlobalWorkerOptions.workerSrc =
				'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

			// Usar la URL local para cargar el PDF
			pdfDoc = await pdfjsLib.getDocument(url).promise;
			totalPages = pdfDoc.numPages;
			renderPage(pageNum);
		} catch (error) {
			console.error('Error cargando el PDF:', error);
		}
	};

	const renderPage = async (num: number) => {
		if (!pdfDoc || !canvas) return;

		try {
			const page = await pdfDoc.getPage(num);
			const viewport = page.getViewport({ scale: 1 });

			canvas.width = viewport.width;
			canvas.height = viewport.height;
			ctx = canvas.getContext('2d');

			if (ctx) {
				const renderContext = {
					canvasContext: ctx,
					viewport,
				};

				await page.render(renderContext).promise;
			}
		} catch (error) {
			console.error('Error renderizando la página:', error);
		}
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


	//Boton para imprimir el PDF
	const printPdf = () => {
		if (!canvas) return;
		const canvasDataUrl = canvas.toDataURL('image/png');
		const printWindow = window.open('', '_blank');
		if (printWindow) {
			printWindow.document.write(`
				<html>
					<head>
						<title>Imprimir PDF</title>
					</head>
					<body style="margin: 0; text-align: center;">
						<img src="${canvasDataUrl}" style="max-width: 100%; height: auto;">
					</body>
				</html>
			`);
			printWindow.document.close();
			printWindow.focus();
			setTimeout(() => {
				printWindow.print();
				printWindow.close();
			}, 500);
		}
	};

	// Cargar el PDF cuando la URL cambie
	$effect(() => {
		if (url) {
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
	{#if url}
		<canvas bind:this={canvas}></canvas>

		<div class="controls">
			<button onclick={prevPage} disabled={pageNum === 1}>&laquo; Anterior</button>
			<button onclick={nextPage} disabled={pageNum === totalPages}>Siguiente &raquo;</button>
			<button onclick={printPdf}>Imprimir</button>
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
