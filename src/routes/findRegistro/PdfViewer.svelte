<script lang="ts">
	import { onMount } from 'svelte';
	import { RegistroStore} from '../../core/store/registroStore';
	import { writable } from 'svelte/store';
	import { PDFDocument, rgb } from 'pdf-lib';


	// Obtener la fecha actual y formatearla
	const currentDate = new Date();
	const formattedDate = currentDate.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});


	let { url } = $props(); // Uso de la runa $props para recibir las propiedades

	// Suscripción reactiva al store
	let registro;
	RegistroStore.subscribe((value) => {
		registro = value;
	});

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


	//Boton para imprimir el PDF --> Imprimir datos del día que se manda a imprimir, nº de página, etc.
	const printPdfconMetaDatos= () => {
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

	// Botón para imprimir el PDF --> Imprimir el PDF directamente, sin agregar nada más
	const printPdf = () => {
		if (!url) {
			console.error("No se puede imprimir: URL del PDF no proporcionada.");
			return;
		}

		// Abrir el archivo PDF en una nueva pestaña y llamar a print()
		const printWindow = window.open(url, '_blank');
		if (printWindow) {
			printWindow.focus();
			setTimeout(() => {
				printWindow.print();
			}, 500); // Espera breve para asegurar la carga
		}
	};


	// Botón para imprimir el PDF --> Imprimir el PDF con los datos del registro seleccionado
	const printPdfWithRegistro = async () => {
		if (!url) {
			console.error("No se puede imprimir: URL del PDF no proporcionada.");
			return;
		}

		try {
			const response = await fetch(url);
			const existingPdfBytes = await response.arrayBuffer();

			// Carga el PDF original
			const pdfDoc = await PDFDocument.load(existingPdfBytes);


			// Agrega una nueva página
			const newPage = pdfDoc.addPage([595, 842]); // Tamaño A4
			const { width, height } = newPage.getSize();


			// Formatear los datos del registro
			const fields = [
				`Fecha Petición: ${formattedDate}`,
				`Sección: ${registro.seccion}`,
				`Tomo: ${registro.tomo}`,
				`Número de Página: ${registro.numeroPagina}`,
				`Lado: ${registro.lado}`,
				`Nombre: ${registro.nombre}`,
				`Primer Apellido: ${registro.primerApellido}`,
				`Segundo Apellido: ${registro.segundoApellido}`,
				`Tipo de Documento: ${registro.tipoDocumento}`,
				`Documento: ${registro.documento}`,
				`Fecha: ${registro.fecha}`,
				`Notas Marginales: ${registro.observaciones}`
			];

			// Dibujar los datos en la nueva página
			newPage.drawText(`Registro Civil de Nigüelas - Registro Seleccionado:`, {
				x: 50,
				y: height - 50,
				size: 18,
				color: rgb(0, 0, 0),
			});

			let yPosition = height - 80; // Posición inicial
			const lineHeight = 20; // Espaciado entre líneas

			fields.forEach((field) => {
				newPage.drawText(field, {
					x: 50,
					y: yPosition,
					size: 12,
					color: rgb(0, 0, 0),
				});
				yPosition -= lineHeight;
			});

			// Guardar el PDF modificado
			const pdfBytes = await pdfDoc.save();

			// Crear un blob para abrir o imprimir
			const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
			const pdfUrl = URL.createObjectURL(pdfBlob);

			// Abrir el PDF en una nueva pestaña para impresión
			const printWindow = window.open(pdfUrl, '_blank');
			if (printWindow) {
				printWindow.focus();
				setTimeout(() => {
					printWindow.print();
					URL.revokeObjectURL(pdfUrl); // Limpia el URL creado
				}, 500);
			}
		} catch (error) {
			console.error('Error al imprimir el PDF:', error);
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
			<button onclick={printPdfWithRegistro}>Imprimir</button>
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
