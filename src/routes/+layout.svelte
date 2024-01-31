<script>
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
</script>

<div class="min-h-screen font-nunito bg-bg dark:bg-bg-dark dark:text-primary-dark text-primary flex flex-col transition-colors duration-2000">
	<div>
		<Nav />
	</div>
	<div>
		<slot />
	</div>	
</div>
