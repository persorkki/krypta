<script>
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
</script>

<div class="min-h-screen font-nunito bg-zinc-900  text-white">
	
		<Nav />
        
		<slot />
	
</div>
