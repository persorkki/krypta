<script lang="ts">
    import { signIn } from "@auth/sveltekit/client";
	function focusOnMount(element: HTMLElement) {
		element.focus();
	}

    let user = ''
    let password = ''

</script>

<form class="text-lg lg:w-4/5 mx-auto flex flex-col justify-center gap-3 py-20">
	<div class="mx-auto">
		<div
			class="rounded-xl p-3 gap-3 flex text-primary bg-border dark:text-primary-dark dark:bg-border-dark text-lg outline-none transition-colors duration-2000">
			<input
				class="w-full outline-none bg-border dark:text-primary-dark font-bold dark:bg-border-dark transition-colors duration-2000"
				placeholder="user"
                bind:value={user}
				use:focusOnMount />

			<svg
				class="w-[36px] pointer-events-none cursor-auto fill-primary dark:fill-primary-dark transition-colors duration-2000"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 24 24"
				><path
					d="M12 5.9a2.1 2.1 0 1 1 0 4.2a2.1 2.1 0 0 1 0-4.2m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"
				></path
				></svg>
		</div>
	</div>
	<div class="mx-auto">
		<div
			class="rounded-xl p-3 gap-3 flex text-primary bg-border dark:text-primary-dark dark:bg-border-dark text-lg outline-none transition-colors duration-2000">
			<input
                type="password"
				class="w-full outline-none bg-border dark:text-primary-dark font-bold dark:bg-border-dark transition-colors duration-2000"
				placeholder="password"
                bind:value={password} />

			<svg
				class="w-[36px] pointer-events-none cursor-auto fill-primary dark:fill-primary-dark transition-colors duration-2000"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 24 24"
				><path
					d="M21 10h-8.35A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H13l2 2l2-2l2 2l4-4.04L21 10zM7 15c-1.65 0-3-1.35-3-3s1.35-3 3-3s3 1.35 3 3s-1.35 3-3 3z"
				></path
				></svg>
		</div>
	</div>
	<button on:click={() => signIn('credentials', { callbackUrl: '/', user, password })} class="mx-auto">
		<div
			class="rounded-xl py-3 px-6 flex text-bg bg-secondary dark:text-bg-dark dark:bg-secondary-dark text-lg outline-none transition-colors duration-2000">
			<div class="">login</div>
		</div>
	</button>
</form>
