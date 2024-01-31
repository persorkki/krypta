<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: { images: { compressed_file_url: string; original_file_url: string }[] };

	let filterText = '';

	function focusOnMount(element: HTMLElement) {
		element.focus();
	}

	function copy(element) {
		navigator.clipboard.writeText(element.target.dataset.url ?? '');
	}

	$: filteredData =
		filterText.length === 0
			? [...data.images]
			: data.images.filter((x) => x.original_file_url.includes(filterText));
</script>

<div class="text-neutral-500 text-md w-4/5 mx-auto">
	<!-- filter -->
	<div class="flex justify-center p-6">
		<div
			class="rounded-xl w-2/6 p-3 gap-3 flex text-primary bg-border dark:text-primary-dark dark:bg-border-dark text-lg outline-none transition-colors duration-2000">
			<input
				class="w-full outline-none bg-border dark:text-primary-dark font-bold dark:bg-border-dark transition-colors duration-2000"
				placeholder="type here to filter..." />
			<svg
				class="w-[36px] pointer-events-none cursor-auto fill-primary dark:fill-primary-dark transition-colors duration-2000"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 24 24"
				><path
					d="M18 13v7H4V6h5.02c.05-.71.22-1.38.48-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5l-2-2zm-1.5 5h-11l2.75-3.53l1.96 2.36l2.75-3.54L16.5 18zm2.8-9.11c.44-.7.7-1.51.7-2.39C20 4.01 17.99 2 15.5 2S11 4.01 11 6.5s2.01 4.5 4.49 4.5c.88 0 1.7-.26 2.39-.7L21 13.42L22.42 12L19.3 8.89zM15.5 9a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5z"
				></path
				></svg>
		</div>
	</div>

	<!-- gallery -->
	<div class="flex flex-wrap bg-border p-6 rounded-xl">
		{#each data.images as image}
			<!--
			<img
				on:click={copy}
				class="aspect-video w-1/5 object-cover dark:dark-mode-img"
				data-url={image.original_file_url}
				src={image.compressed_file_url}
				alt={image.original_file_url} />
			-->
			<video
				autoPlay
				loop
				muted
				playsInline
				class="aspect-video w-1/5 object-cover"
				data-url={image.original_file_url}
				on:click={copy}>
				<source type="video/webm" src={image.compressed_file_url} />
			</video>
		{/each}
	</div>
</div>
