<script lang="ts">
	import '../../app.css';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import { PUBLIC_FILE_SIZE_LIMIT } from '$env/static/public';
</script>

<div class="lg:w-4/5 mx-auto">
	<div class="lg:grid lg:grid-cols-5">
		<nav in:slide={{ axis: 'x', duration: 600 }} class="flex flex-row lg:block lg:py-6">

			<!-- left sidebar -->
			<a
				href="/dashboard/upload"
				class="{$page.url.pathname === '/dashboard/upload'
					? 'border-l-secondary dark:border-l-secondary text-secondary dark:text-secondary-dark'
					: 'border-l-border hover:border-l-primary dark:border-l-border_dark hover:dark:border-l-primary'} group p-3 border-l-2 text-lg font-sans font-bold flex gap-3 justify-between">
				<p>upload</p>
			</a>
			<a
				href="/dashboard/maintenance"
				class="{$page.url.pathname === '/dashboard/maintenance'
					? 'border-l-secondary dark:border-l-secondary text-secondary dark:text-secondary-dark'
					: 'border-l-border hover:border-l-primary dark:border-l-border_dark hover:dark:border-l-primary'} group p-3 border-l-2 text-lg font-sans font-bold flex gap-3 justify-between">
				<p class="group-hover:text-neutral-300">maintenance</p>
				<!--
				<p
					class="group-hover:visible invisible group-hover:-translate-x-8 duration-300 text-emerald-300">
					←
				</p>
				-->
			</a>
		</nav>
		
		<!-- main content -->
		<div class="col-span-3 py-6">
			
			<slot />
		</div>

		<!-- right side info box -->
		{#if $page.url.pathname === '/dashboard/upload'}
			<div class="py-6">
				<div class="flex flex-col w-4/5 mx-auto py-6 invisible text-xl">ignore</div>
				<div class="text-xl invisible">ignore</div>
				<div class="flex flex-col gap-3">
					<p>
						<span class="text-secondary dark:text-secondary-dark">-</span> only
						<span class="text-secondary dark:text-secondary-dark">gif</span> files are allowed
					</p>
					<p>
						<span class="text-secondary dark:text-secondary-dark">-</span>
						maximum file size is
						<span class="text-secondary dark:text-secondary-dark"
							>{parseInt(PUBLIC_FILE_SIZE_LIMIT) / 1000000} MiB</span>
					</p>
					<p>
						<span class="text-secondary dark:text-secondary-dark">-</span> uploads are automatically added to 
						<span class="text-secondary dark:text-secondary-dark">online/offline</span> status messages
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
