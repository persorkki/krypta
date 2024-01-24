<script lang="ts">
	export let text: string;
	export let href: string;
	export let activePath: string;
	$: activeLink =
		href === activePath
			? 'bg-emerald-9000 text-whitee border-l-emerald-600 border-r-emerald-600'
			: 'text-white hover:text-zinc-700';
</script>

<a class="{activeLink} font-bold px-4 py-2 border-l-2 border-r-2 border-transparent" {href}>{text}</a>
