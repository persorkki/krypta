<script>
    import { signIn } from "@auth/sveltekit/client";
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => signIn('credentials')}
	class="cursor-pointer flex justify-center items-center gap-1 text-emerald-500">
	<div class="hidden lg:block">login</div>
	<!--<img class="h-icons-normal" src="/LogIn.svg" alt="login" />-->
	<svg
		class="h-icons-normal fill-primary dark:fill-primary-dark transition-colors duration-2000"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 24 24"
		><path
			d="M9 2h9c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H9c-1.1 0-2-.9-2-2v-2h2v2h9V4H9v2H7V4c0-1.1.9-2 2-2z"
		></path
		><path d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67z"></path></svg>
</div>
