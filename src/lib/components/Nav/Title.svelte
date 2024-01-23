<script>
    export let state = false;
    $: colorState = state ? "text-emerald-600" : "text-rose-600";
</script>

<h1 class="text-4xl">
    krypta<span class="{colorState}">live</span>
</h1>
