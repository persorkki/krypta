<script>
	import '../../app.css';
	import Side from '$lib/components/Side.svelte';
</script>

<div class="flex">
	<!-- sidebar -->
	<div class="w-1/6">
    <Side/>
	</div>
	<div class="w-4/6">
		<slot />
	</div>
</div>
