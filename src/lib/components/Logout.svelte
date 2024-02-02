<script>
	import { signOut } from '@auth/sveltekit/client';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => signOut({ callbackUrl: '/' })}
	class="cursor-pointer flex justify-center items-center gap-1 text-emerald-500">
	<div class="hidden lg:block">logout</div>
	<!--<img class="h-icons-normal" src="/LogIn.svg" alt="login" />-->
	<svg
		class="h-icons-normal fill-primary dark:fill-primary-dark transition-colors duration-2000"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 24 24"
		><path
			d="M6 2h9a2 2 0 0 1 2 2v2h-2V4H6v16h9v-2h2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
			></path
		><path d="M16.09 15.59L17.5 17l5-5l-5-5l-1.41 1.41L18.67 11H9v2h9.67z" fill="currentColor"
		></path
		></svg>
</div>
