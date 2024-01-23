<script>
	import { page } from '$app/stores';
	import { elasticIn, quadIn, quintIn, sineIn, bounceIn} from 'svelte/easing';
	import Link from './Side/Link.svelte';
	import { fade, slide } from 'svelte/transition';
	$: activePath = $page.url.pathname;
</script>

<!--
<div
	in:slide={{duration:300,easing: sineIn, axis: 'x'}}
	class="fixed left-20 top-13 w-1/6  flex h-full  border-r-zinc-800  " 
>
	<div class="flex flex-col gap-6 p-6 w-full">
        
		<Link {activePath} href="/dashboard/upload" text="upload" />
		<Link {activePath} href="/dashboard" text="messages" />
	</div>
</div>
-->
<div in:slide={{ duration: 350, easing: sineIn, axis: 'x' }} class=" w-[200px]">
	<div class="flex flex-col gap-6 p-6 w-full border-r-zinc-800 h-screen border-r">
		<Link {activePath} href="/dashboard/upload" text="upload" />
		<Link {activePath} href="/dashboard" text="messages" />
	</div>
</div>
