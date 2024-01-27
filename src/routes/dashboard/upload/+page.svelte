<script lang="ts">
	import { PUBLIC_FILE_SIZE_LIMIT } from '$env/static/public';

	let currentFile: File | undefined;
	let uploadState = 'ready';
	let isDragOver = false;
	let dragStyle = '';

	$: dragStyle = isDragOver ? 'bg-zinc-500' : 'bg-zinc-900';

	function eventFileDropped(event: DragEvent) {
		console.log(event.dataTransfer?.files[0]);
		currentFile = event.dataTransfer?.files[0];
		isDragOver = false;
	}

	function filePicked(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files) {
			return;
		}
		currentFile = input.files[0];
		isDragOver = false;
	}

	async function uploadFile() {
		if (currentFile) {
			uploadState = 'uploading...';
			const formData = new FormData();
			formData.append('file', currentFile);

			const res = await fetch('/dashboard/upload', {
				method: 'POST',
				body: formData,
				headers: {
					'Cache-Control': 'no-cache'
				}
			});

			if (res.ok) {
				currentFile = undefined;
				try {
					const response = await res.json();

					uploadState = response.message;
				} catch (error) {
					uploadState = "Server didn't send a valid response";
				}
			} else {
				uploadState = 'error during upload';
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
		<p>❗ size limit is {parseInt(PUBLIC_FILE_SIZE_LIMIT) / 1000000} MB</p>
	</div>

	<!-- upload box -->
	<form class=" flex flex-col gap-6">
		<div class="mx-auto">{uploadState}</div>
		<!-- TODO: add colors and so on-->
		<!-- TOOD: fix weird behaviour with dropzone. maybe remove the whole dropzone thing and make it a regular upload -->
		<div class="h-60 items-center flex justify-center rounded-sm">
			<label
				on:drop|preventDefault|stopPropagation={eventFileDropped}
				on:dragover|preventDefault|stopPropagation={() => {
					isDragOver = true;
				}}
				on:dragend|preventDefault|stopPropagation={() => {isDragOver = false;}}
				on:dragleave={() => {
					isDragOver = false;
				}}
				on:input={filePicked}
				for="dropzone"
				class="w-full items-center flex flex-col justify-center h-full {dragStyle} truncate border-dashed border-2 border-emerald-900 hover:border-emerald-700"
			>
				{#if currentFile}
					<p class="pointer-events-none">{currentFile.name}</p>
				{:else}
					<p class="pointer-events-none">drop file here</p>
				{/if}
				<input id="dropzone" type="file" class="hidden pointer-events-none" />
			</label>
		</div>
		<!--TODO: remove button -->
		<div
			on:click={uploadFile}
			class="items-center flex justify-center w-full bg-emerald-900 hover:bg-emerald-700 rounded-sm cursor-pointer"
		>
			<div class="p-4 text-lg font-bold">upload</div>
		</div>
	</form>
</div>
