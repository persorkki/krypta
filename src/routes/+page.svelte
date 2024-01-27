<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data: { images: { original_file_url: string }[] };
	let filterText = '';

	function focusOnMount(element: HTMLElement) {
		element.focus();
	}

	$: filteredData =
		filterText.length === 0
			? [...data.images]
			: data.images.filter((x) => x.original_file_url.includes(filterText));
</script>

<div class="text-neutral-500 text-md w-4/5 mx-auto">
	<!-- filter -->
	<div class=" flex justify-center rounded-tr-xl rounded-tl-xl py-3">
		<div class="w-2/6 py-1 gap-3 p-1 flex bg-neutral-50 border-b-4 border-b-emerald-500 text-lg outline-none">
			<input
				class="w-full outline-none bg-neutral-50"
				placeholder="type here to filter..."
			/>
			<img class="w-[41px] pointer-events-none cursor-auto" src="SearchOutlined.svg" alt="search icon" />
		</div>
	</div>
	<!-- gallery -->
	<div class="flex flex-wrap">
		{#each data.images as image}
			<img
				class="aspect-video w-1/5 object-cover"
				src={image.original_file_url}
				alt={image.original_file_url}
			/>
		{/each}
	</div>
</div>
<!--
<div class="justify-center">
	<div class="flex justify-center py-3 px-6">

		<label class="py-3 w-2/5 bg-zinc-900 text-white flex border-b-2 border-b-emerald-600">
			
			
			<input
				use:focusOnMount
				class="w-full text-center outline-none text-lg bg-zinc-900 "
				placeholder="type here to filter..."
				bind:value={filterText}
			/>
			
			<svg
				class="h-[28px]"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				fill="#059669"
				viewBox="0 0 512 512"
				enable-background="new 0 0 512 512"
				xml:space="preserve"
				><path
					d="M443.5,420.2L336.7,312.4c20.9-26.2,33.5-59.4,33.5-95.5c0-84.5-68.5-153-153.1-153S64,132.5,64,217s68.5,153,153.1,153
				c36.6,0,70.1-12.8,96.5-34.2l106.1,107.1c3.2,3.4,7.6,5.1,11.9,5.1c4.1,0,8.2-1.5,11.3-4.5C449.5,437.2,449.7,426.8,443.5,420.2z
				 M217.1,337.1c-32.1,0-62.3-12.5-85-35.2c-22.7-22.7-35.2-52.9-35.2-84.9c0-32.1,12.5-62.3,35.2-84.9c22.7-22.7,52.9-35.2,85-35.2
				c32.1,0,62.3,12.5,85,35.2c22.7,22.7,35.2,52.9,35.2,84.9c0,32.1-12.5,62.3-35.2,84.9C279.4,324.6,249.2,337.1,217.1,337.1z"
				></path></svg
			>
		</label>
		
	</div>
	<div class="flex flex-wrap justify-center px-6">
		{#each filteredData as image}
			<img class="object-cover h-40 w-1/5" src={image.original_file_url} alt={image.original_file_url} />
		{/each}
	</div>
</div>
-->
