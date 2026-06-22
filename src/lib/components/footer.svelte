<script lang="ts">
	import { page } from '$app/stores';
	const year = new Date().getFullYear();
</script>

<footer class="border-t-4 border-brand-blue bg-brand-dark text-brand-white">
	<div class="mx-auto max-w-[1460px] px-7 py-10 sm:px-10 lg:py-12">
		<div class="grid gap-10 md:grid-cols-3 md:gap-14">
			<div>
				<a href="/" class="inline-flex items-center gap-3" aria-label="Dicionário LGP - Início">
					<img src="/branding/brandmark light.svg" alt="" class="h-12 w-10 object-contain" />
					<span class="max-w-[210px] text-sm font-bold leading-tight">
						O Dicionário Online de<br />Língua Gestual Portuguesa
					</span>
				</a>
			</div>
		</div>
		<div
			class="mt-10 border-t border-brand-yellow pt-7 text-center text-sm font-semibold text-brand-white/85"
		>
			© {year}
			{$page.data.branding.name}
		</div>
	</div>
</footer>
