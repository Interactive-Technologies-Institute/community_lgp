<script lang="ts">
	export let title: string;
	export let subtitle: string;
</script>

<div class="container py-6 md:py-8">
	<h1 class="mb-1 text-center text-4xl font-bold">{title}</h1>
	<p class="mx-auto max-w-xl text-center text-lg text-muted-foreground">{subtitle}</p>
</div>
