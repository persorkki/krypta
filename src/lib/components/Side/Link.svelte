<script lang="ts">
	export let text: string;
	export let href: string;
	export let activePath: string;
	$: activeLink =
		href === activePath
			? 'text-emerald-600 bg-emerald-900 text-white'
			: 'text-white hover:text-zinc-300';
</script>

<a class="{activeLink} font-bold rounded-sm px-4 py-2" {href}>{text}</a>
