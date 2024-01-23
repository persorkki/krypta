<script lang="ts">
	export let text: string;
    export let href: string;

    export let activePath: string;
	$: activeLink = activePath === href ? 'text-emerald-600' : 'text-white hover:text-zinc-300';
</script>

<a {href} class="{activeLink} font-semibold  rounded-md cursor-pointer">
	{text}
</a>
