<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: { images: { url: string }[] };
	let filterText = '';

	function focusOnMount(element: HTMLElement) {
		element.focus();
	}

	$: filteredData =
		filterText.length === 0
			? [...data.images]
			: data.images.filter((x) => x.url.includes(filterText));
</script>

<div class="justify-center">
	<div class="flex justify-center text-lg p-2 px-6">
		
		<input use:focusOnMount class="w-1/5 px-3 py-1 outline-none bg-white text-black placeholder-zinc-700" placeholder="type here to filter..." bind:value={filterText} />
		
	</div>
	<div class="flex flex-wrap justify-center px-6">
		{#each filteredData as image}
			<img class="object-cover h-40 w-1/5" src={image.url} alt={image.url} />
		{/each}
	</div>
</div>
