<script lang="ts">
	let currentFile: File | undefined;
	function evntFileDropped(event: DragEvent) {
		//TODO: set file to a variable and make a rudimentary upload functional

		currentFile = event.dataTransfer?.files[0];
		dragStyle = 'bg-zinc-900';
	
	}
	let dragStyle = '';

	async function uploadFile() {
		if (currentFile) {
			const formData = new FormData();
			formData.append('file', currentFile);

			const res = await fetch('/dashboard/upload', {
				method: 'POST',
				body: formData,
				headers: {
					'Cache-Control': 'no-cache'
				}
			});
			//TODO: do something with the response
			//TODO: check for successful upload and clear the currentFile var

			if (res.ok) {
				currentFile = undefined;
				try {
					const response = await res.json();
					console.log(response);
				} catch (error) {
					console.log(res);
					console.log(error);
				}

				console.log('hello');
			}
		}
	}
</script>

<div class="py-6 w-2/3 mx-auto">
	<h2 class="text-2xl pb-3 font-bold">Rules</h2>
	<!-- info -->
	<div class="text-justify pb-6">
		<p>❗ only <span class="text-rose-600">.gif</span> uploads allowed</p>
		<!-- TODO: add GET endpoint to get the max file size limit from the server -->
		<p>❗ size limit is 3MiB</p>
	</div>

	<!-- upload box -->
	<form class=" flex flex-col gap-6">
		<div class="h-60 items-center flex justify-center rounded-sm">
			<label
				on:drop|preventDefault={evntFileDropped}
				on:dragover|preventDefault={() => {
					dragStyle = 'bg-zinc-500';
				}}
				on:dragleave={() => {
					dragStyle = 'bg-zinc-900';
				}}
				for="dropzone"
				class="w-full items-center flex flex-col justify-center h-full {dragStyle} truncate border-dashed border-2 border-emerald-900 hover:border-emerald-700"
			>
				{#if currentFile}
					<p class="">{currentFile.name}</p>
				{:else}
					<p>drop file here</p>
				{/if}
				<input id="dropzone" type="file" class="hidden" />
			</label>
		</div>
		<!--TODO: remove button -->
		<div on:click={uploadFile} 
			class="items-center flex justify-center w-full bg-emerald-900 hover:bg-emerald-700 rounded-sm cursor-pointer"
		>
			<div class="p-4 text-lg font-bold">upload</div>
		</div>
	</form>
</div>
