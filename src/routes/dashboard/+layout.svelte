<script>
	import '../../app.css';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
</script>

<div class="w-4/5 mx-auto py-12">
	<div class="grid grid-cols-5">
		<nav in:slide={{ axis: 'x', duration: 600 }} class="py-3">
			<!-- TODO: make into components -->
			<a
				href="/dashboard/upload"
				class="p-3 bg-emerald-500 text-white text-lg font-sans font-bold w-full flex">
				<p>upload</p>
			</a>
			<a
				href="/dashboard/"
				class="group p-3 text-neutral-500 border-l-2 border-l-emerald-500 text-lg font-sans font-bold flex gap-3 justify-between">
				<p class="group-hover:text-neutral-300">messages</p>
				<p
					class="group-hover:visible invisible group-hover:-translate-x-8 duration-300 text-emerald-300">
					←
				</p>
			</a>
			<a
				href="/dashboard/maintenance"
				class="group p-3 text-neutral-500 border-l-2 border-l-emerald-500 text-lg font-sans font-bold flex gap-3 justify-between">
				<p class="group-hover:text-neutral-300">maintenance</p>
				<p
					class="group-hover:visible invisible group-hover:-translate-x-8 duration-300 text-emerald-300">
					←
				</p>
			</a>
		</nav>
		<div class="col-span-3 py-3">
			<slot />
		</div>

		{#if $page.url.pathname === '/dashboard/upload'}
			<div class="py-3">
				<p>only <span class="text-rose-500">gif</span> files are allowed</p>
				<p>maximum file size is <span class="text-rose-500">40 MiB</span></p>
			</div>
		{/if}
	</div>
</div>
