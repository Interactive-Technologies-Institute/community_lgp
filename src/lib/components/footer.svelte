<script lang="ts">
	import { page } from '$app/stores';

	let year = new Date().getFullYear();
</script>

<div class="flex h-40 flex-col items-center justify-between border border-t py-6">
	<div class="flex flex-col items-center">
		<div class="h-4 w-4 rounded-full bg-primary"></div>
		<p class="font-bold">{$page.data.branding.name}</p>
	</div>
	<p>© {year} {$page.data.branding.name}</p>
</div>
