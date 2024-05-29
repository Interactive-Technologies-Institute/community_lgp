<script lang="ts">
	export let data;
	$: ({ branding } = data);
</script>

<div class="container mx-auto mb-20 mt-20 flex flex-col items-center justify-center md:mt-40">
	<div class="mb-6 h-32 w-32 rounded-full bg-primary md:h-48 md:w-48"></div>
	<h1 class="mb-4 text-center text-6xl font-bold md:text-8xl">{branding.name}</h1>
	<p class="text-center text-xl text-muted-foreground md:text-3xl">{branding.slogan}</p>
</div>
