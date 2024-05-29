<script lang="ts">
	export let data;
	$: ({ branding } = data);
</script>

<div class="container mx-auto mb-20 mt-40 flex flex-col items-center justify-center">
	<div class="mb-6 h-48 w-48 rounded-full bg-primary"></div>
	<h1 class="mb-4 text-8xl font-bold">{branding.name}</h1>
	<p class="text-3xl text-muted-foreground">{branding.slogan}</p>
</div>
