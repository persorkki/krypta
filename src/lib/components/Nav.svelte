<script>
	import Title from './Nav/Title.svelte';
	import Link from './Nav/Link.svelte';
	import { page } from '$app/stores';

	$: activePath = $page.url.pathname;
</script>

<!-- on every page, set the border and then (py-4, w-5/6, mx-auto) wrap -->
<div class="border-b-zinc-800 border-b">
	<div class="grid grid-cols-3 justify-between items-center p-6  mx-auto">
		<Title />
		<nav class="text-2xl flex flex-row justify-evenly gap-4">
			<Link href="/" text="gifs" {activePath} />
			<Link href="/dashboard/upload" text="dashboard" {activePath} />
			<!--
			<Link href="/upload" text="upload" {activePath} />
			-->
			
		</nav>
		<nav class="text-2xl flex flex-row gap-4 justify-end">
			<a href="/">login</a>
			<!--<Link href="/" text="login" {activePath} /> -->
		</nav>
	</div>
</div>
