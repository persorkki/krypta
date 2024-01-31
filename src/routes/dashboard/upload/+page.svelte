<script lang="ts">
	import { PUBLIC_FILE_SIZE_LIMIT } from '$env/static/public';
	import { elasticIn, elasticOut} from 'svelte/easing';
	import { fly, slide } from 'svelte/transition';

	let currentFile: File | undefined;
	let uploadState = 'Ready';
	let isDragOver = false;
	let dragStyle = '';

	let wasLinkCopied = false;

	let copyLink: string = '';
	$: dragStyle = isDragOver ? 'scale-110' : '';

	function copy(element) {
		navigator.clipboard.writeText(element.target.textContent);
		wasLinkCopied = true;
		element;
		setTimeout(() => {
			wasLinkCopied = false;
		}, 5000);
	}

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
					copyLink = response.url;
				} catch (error) {
					uploadState = "Server didn't send a valid response";
				}
			} else {
				uploadState = 'error during upload';
			}
		}
	}
</script>

<div class="flex flex-col w-4/5 mx-auto">
	<!-- upload box -->
	<form class=" flex flex-col gap-3">
		<!-- TODO: uplloadState needs to be a object or something that has the colors and state together -->
		<div
			class=" text-secondary dark:text-secondary-dark text-xl font-bold font-sans {isDragOver
				? '-translate-y-4  '
				: ''} transition ease-in-out duration-300">
			{uploadState}
		</div>
		{#if copyLink}
			<div on:click={copy} class="py-3 flex justify-between cursor-pointer">
				click to copy:<span class="text-secondary dark:text-secondary-dark rounded-lg px-1"
					>{copyLink}</span>
			</div>
		{:else}
			<div class="py-3 flex justify-between text-primary dark:text-primary-dark">idle</div>
		{/if}
		<!-- TODO: add colors and so on-->
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
				class="w-full aspect-video border-dashed border transition ease-in-out duration-300 {dragStyle} border-primary flex items-center justify-center mx-auto">
				{#if currentFile}
					<p class="pointer-events-none">{currentFile.name}</p>
				{:else}
					<p class="pointer-events-none font-bold text-xl">drag & drop</p>
				{/if}
				<input id="dropzone" type="file" class="hidden pointer-events-none" />
			</label>
		</div>

		<div class="flex justify-between gap-3 py-3">
			<div
				on:click={uploadFile}
				class="{isDragOver
					? 'translate-y-4  '
					: ''} transition ease-in-out duration-300 w-full bg-border dark:bg-border-dark text-primary dark:bg-primary-dark items-center flex justify-center hover:-translate-y-1 shadow-md hover:drop-shadow-md cursor-pointer">
				<div class="p-4 text-lg font-bold">upload</div>
			</div>
			<!--
			<div
				on:click={uploadFile}
				class="{isDragOver
					? 'translate-y-4  '
					: ''} transition ease-in-out duration-300 w-2/5 bg-border dark:text-bg text-primary dark:bg-border items-center flex justify-center  hover:-translate-y-1 shadow-md hover:drop-shadow-md cursor-pointer">
				<div class="p-4 text-lg font-bold">clear</div>
			</div>
			-->
		</div>
	</form>
	{#if wasLinkCopied}
	<div on:click={() => wasLinkCopied = !wasLinkCopied } out:fly={{ duration: 800}} in:fly={{ duration: 500, y: 64, easing:elasticOut }} class="fixed left-0 right-0 bottom-0 bg- flex justify-center items-end p-6">
		<div class="toast bg-secondary text-primary-dark font-bold font-sans text-lg p-6 rounded-xl drop-shadow-lg cursor-pointer">Link copied!</div>
	</div>
	{/if}
</div>
