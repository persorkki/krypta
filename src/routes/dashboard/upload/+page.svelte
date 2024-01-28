<script lang="ts">
	import { PUBLIC_FILE_SIZE_LIMIT } from '$env/static/public';

	let currentFile: File | undefined;
	let uploadState = 'ready to upload';
	let isDragOver = false;
	let dragStyle = '';

	$: dragStyle = isDragOver ? 'scale-110' : '';

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

<div class="text-neutral-500 flex flex-col w-4/5 mx-auto">
	<!-- upload box -->
	<form class=" flex flex-col gap-3">
		<!-- TODO: uplloadState needs to be a object or something that has the colors and state together -->
		<div
			class=" text-emerald-500 py-3 text-2xl {isDragOver
				? '-translate-y-4  '
				: ''} transition ease-in-out duration-300">
			{uploadState}
		</div>
		<!-- TODO: add colors and so on-->
		<!-- TOOD: fix weird behaviour with dropzone. maybe remove the whole dropzone thing and make it a regular upload -->
		<div class="flex justify-center rounded-sm">
			<label
				on:drop|preventDefault|stopPropagation={eventFileDropped}
				on:dragover|preventDefault|stopPropagation={() => {
					isDragOver = true;
				}}
				on:dragend|preventDefault|stopPropagation={() => {
					isDragOver = false;
				}}
				on:dragleave={() => {
					isDragOver = false;
				}}
				on:input={filePicked}
				for="dropzone"
				class="w-full aspect-video border-dashed border-2 transition ease-in-out duration-300 {dragStyle}  hover:border-neutral-500 border-neutral-200 flex items-center justify-center mx-auto">
				{#if currentFile}
					<p class="pointer-events-none">{currentFile.name}</p>
				{:else}
					<p class="pointer-events-none">drag & drop</p>
				{/if}
				<input id="dropzone" type="file" class="hidden pointer-events-none" />
			</label>
		</div>
		<!--TODO: remove button -->
		<div
			on:click={uploadFile}
			class="{isDragOver
				? 'translate-y-4  '
				: ''} transition ease-in-out duration-300 items-center flex justify-center w-full bg-neutral-100 hover:bg-neutral-100 hover:-translate-y-1 shadow-md hover:drop-shadow-md cursor-pointer">
			<div class="p-4 text-lg font-bold">upload</div>
		</div>
	</form>
</div>
