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

<div class="justify-center rounded-xl">
	<div class="flex justify-center gap-3 pt-6">
		<div>filter</div>
		<input use:focusOnMount class="w-1/5 outline-none text-black px-2" bind:value={filterText} />
	</div>
	<div class="flex flex-wrap justify-center p-6">
		{#each filteredData as image}
			<img class="object-cover h-40 w-1/5" src={image.url} alt={image.url} />
		{/each}
	</div>
</div>
