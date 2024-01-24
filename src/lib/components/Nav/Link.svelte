<script lang="ts">
	export let text: string;
    export let href: string;

    export let activePath: string;
	$: activeLink = activePath === href ? ' border-b-emerald-600 ' : 'text-white hover:text-zinc-700';
</script>

<a {href} class="{activeLink} font-semibold  cursor-pointer border-b-2 border-transparent">
	{text}
</a>
