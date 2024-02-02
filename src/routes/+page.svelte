<script lang="ts">
	import { elasticOut } from "svelte/easing";
	import { fly } from "svelte/transition";

	/** @type {import('./$types').PageData} */
	export let data: { images: { compressed_file_url: string; filename: string, original_file_url: string }[] };
	
	let wasLinkCopied = false;
	let filterText = '';


	function focusOnMount(element: HTMLElement) {
		element.focus();
	}

	function copy(element) {
		navigator.clipboard.writeText(element.target.dataset.url);
		wasLinkCopied = true;
		
		setTimeout(() => {
			wasLinkCopied = false;
		}, 5000);
	}

	$: console.log(filterText);
	$: console.log(filteredData);
	$: filteredData =
		filterText.length <= 0
			? [...data.images]
			: data.images.filter((x) => x.filename.includes(filterText));
</script>


<div class="text-neutral-500 text-md lg:w-4/5 mx-auto">
	<!-- filter -->
	<div class="flex justify-center lg:p-6 p-3">
		<div
			class="rounded-xl lg:w-2/6 w-full p-3 gap-3 flex text-primary bg-border dark:text-primary-dark dark:bg-border-dark text-lg outline-none transition-colors duration-2000">
			<input
				class="w-full outline-none bg-border dark:text-primary-dark font-bold dark:bg-border-dark transition-colors duration-2000"
				placeholder="type here to filter..."
				bind:value={filterText}
				use:focusOnMount />
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
	<div class="flex flex-wrap bg-border dark:bg-border-dark">
		{#each filteredData as image (image.id)}
			<video
				autoPlay
				loop
				muted
				playsInline
				class="lg:aspect-video aspect-square lg:w-1/4 w-2/6 object-cover"
				data-url={image.original_file_url}
				on:click={copy}>
				<source type="video/webm" src={image.compressed_file_url} />
			</video>
		{/each}
	</div>
	{#if wasLinkCopied}
	<div on:click={() => wasLinkCopied = !wasLinkCopied } out:fly={{ duration: 800}} in:fly={{ duration: 500, y: 64, easing: elasticOut }} class="fixed left-0 right-0 bottom-0 bg- flex justify-center items-end p-6">
		<div class="toast bg-secondary text-primary-dark font-bold font-sans text-lg p-6 rounded-xl drop-shadow-lg cursor-pointer">Link copied!</div>
	</div>
	{/if}
</div>
