<script>
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
</script>

<div class="min-h-screen font-nunito bg-neutral-50 text-neutral-500">
	<Nav />
	<slot />
</div>
