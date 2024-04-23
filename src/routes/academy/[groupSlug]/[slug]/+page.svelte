<script lang="ts">
	export let data;
</script>

<div class="prose max-w-none dark:prose-invert">
	<svelte:component this={data.content} />
</div>
