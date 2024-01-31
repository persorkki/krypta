<script lang="ts">
	import { page } from '$app/stores';

	export let link: string;
</script>

<a
	href="/dashboard/"
	class="{$page.url.pathname === '/dashboard'
		? 'border-l-secondary dark:border-l-secondary text-secondary dark:text-secondary-dark'
		: 'border-l-border  hover:border-l-primary dark:border-l-border-dark hover:dark:border-l-primary'} transition-colors duration-2000 group p-3 border-l-2 text-lg font-sans font-bold flex gap-3 justify-between">
	<p class="">messages</p>
</a>
