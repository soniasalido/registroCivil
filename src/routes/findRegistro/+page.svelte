
<script lang="ts">
	import { Footer, Header, NavFindRegistro } from '$lib';

	import FindRegistroForm from './FindRegistroForm.svelte';

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
