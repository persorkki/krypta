<script lang="ts">
	import { fly } from 'svelte/transition';

	import { page } from '$app/stores';

	import Login from './Login.svelte';
	import Logout from './Logout.svelte';

	let darkMode = false;
	function toggleDarkMode() {
		darkMode = !darkMode;

		darkMode
			? document.documentElement.classList.add('dark')
			: document.documentElement.classList.remove('dark');
	}
</script>

<div class="border-b border-b-border dark:border-b-border-dark transition-colors duration-2000">
	<div class="flex py-6 w-4/5 mx-auto text-3xl flex-col lg:flex-row lg:justify-between">
		<!-- title -->
		<div class="font-sans font-bold hidden lg:block">
			krypta.<span class="dark:text-secondary-dark text-secondary">live</span>
		</div>

		<!-- navlinks -->
		<nav class="flex gap-6 justify-evenly lg:justify-normal">
			<a class="flex justify-center items-center gap-1 group" href="/">
				<div class="hidden lg:block">gifs</div>
				<svg
					class="h-icons-normal fill-primary dark:fill-primary-dark transition-colors duration-2000"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 32 32"
					><path d="M19 14a3 3 0 1 0-3-3a3 3 0 0 0 3 3zm0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1z"></path
					><path
						d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 22H6v-6l5-5l5.59 5.59a2 2 0 0 0 2.82 0L21 19l5 5zm0-4.83l-3.59-3.59a2 2 0 0 0-2.82 0L18 19.17l-5.59-5.59a2 2 0 0 0-2.82 0L6 17.17V6h20z"
					></path
					></svg>
				<!--<img class="h-icons-normal" src="/Image.svg" alt="gifs" />-->
			</a>

			{#if $page.data.session}
			<a class="flex justify-center items-center gap-1 group" href="/dashboard/upload">
				<div class="hidden lg:block">dashboard</div>
				<svg
					class="h-icons-normal fill-primary dark:fill-primary-dark transition-colors duration-2000"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 24 24"
					><path
						d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v3h-3v2h3v3h2v-3h3v-2h-3z"
					></path
					></svg>
				<!--<img class="h-icons-normal" src="/Dashboard.svg" alt="dashboard" />-->
			</a>
			{/if}
			<!-- divider  -->
			<div
				class="hidden lg:block border-l border-l-border dark:border-l-border-dark transition-colors duration-2000">
			</div>

			<!-- dark mode switch -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div on:click={toggleDarkMode} class="cursor-pointer flex items-center justify-center">
				{#if darkMode}
					<svg
						in:fly={{ duration: 1000, y: 64 }}
						class="h-icons-normal fill-primary-dark"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 24 24"
						><path
							d="M6.76 4.84l-1.8-1.79l-1.41 1.41l1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495l1.408 1.407l-1.79 1.79l-1.407-1.408zm-1.8 15.115l1.79 1.8l1.41-1.41l-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4zm-1 4h2v2.95h-2zm-7.45-.96l1.41 1.41l1.79-1.8l-1.41-1.41z"
						></path
						></svg>
				{:else}
					<svg
						in:fly={{ duration: 1000, y: -64 }}
						class="h-icons-normal fill-primary"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 24 24"
						><path
							d="M9.37 5.51A7.35 7.35 0 0 0 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4c.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0 1 12 19c-3.86 0-7-3.14-7-7c0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
						></path
						></svg>
				{/if}
				<!--<img class="h-icons-normal" src="/LightMode.svg">-->
			</div>

			<div
				class="hidden lg:block border-l border-l-border dark:border-l-border-dark transition-colors duration-2000">
			</div>
			<!-- login -->
			{#if !$page.data.session}
				<Login />
			{:else}
				<Logout />
			{/if}
		</nav>
	</div>
</div>
