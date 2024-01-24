<script>
    /** @type {import('./$types').PageData} */
    export let data;
    console.log(data);
</script>

<div class="flex justify-center p-6">
    {#each data.images as image }
        <img class="object-cover h-40 w-1/5" src={image.url}/>
    {/each}
</div>