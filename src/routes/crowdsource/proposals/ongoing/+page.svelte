<script lang="ts">
	import { goto } from '$app/navigation';
	import { stringQueryParam } from '@/utils';
	import { queryParam } from 'sveltekit-search-params';
    import { browser } from '$app/environment';
    import * as Pagination from '$lib/components/ui/pagination';
	import ProposalGrid from './_components/ProposalGrid.svelte';
	import PageHeader from '@/components/page-header.svelte';
	import { MetaTags } from 'svelte-meta-tags';
    export let data;
    let totalPages = data.totalPages ?? 1;
	let perPage = data.perPage ?? 9;
    let countSign = data.countSign ?? 0;
    
    const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});
    const page = queryParam('page', stringQueryParam(), {
		debounceHistory: 250,
	});

    $: currentPageNumber = (data?.page ?? 1)
    $: countSign = data.countSign ?? 0;
    $: signsWithUsers = data.signsWithUsers;
    function buildUrlWithUpdatedPage(page: number): string {
		if (!browser) return '#'; // SSR-safe fallback
		const url = new URL(window.location.href);
		url.searchParams.set('page', String(page));
		return `${url.pathname}?${url.searchParams.toString()}`;
	}

    function goToPreviousPage() {
		if (currentPageNumber > 1) {
			const newUrl = buildUrlWithUpdatedPage(currentPageNumber - 1);
			goto(newUrl);
		}
	}

	function goToNextPage() {
		if (currentPageNumber < totalPages) {
			const newUrl = buildUrlWithUpdatedPage(currentPageNumber + 1);
			goto(newUrl);
		}
	}
</script>

<MetaTags
	title="Propostas a decorrer"
	description="Visualize todas as propostas que estão a decorrer"
/>

<PageHeader
	title="Propostas a decorrer"
	subtitle="Visualize todas as propostas que estão a decorrer"
/>

<div class="mx-auto flex max-w-[1400px] flex-col px-[30px] pt-5">
<ProposalGrid signs={signsWithUsers}></ProposalGrid>
</div>
{#if countSign > 0}
			<div class="flex items-start justify-start py-5">
				<Pagination.Root count={countSign} {perPage} let:pages let:currentPage>
					<Pagination.Content class="flex items-center justify-center gap-2">
						<Pagination.Item>
							<Pagination.PrevButton on:click={goToPreviousPage} disabled={currentPageNumber === 1}>
								Anterior
							</Pagination.PrevButton>
						</Pagination.Item>

						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link
										{page}
										isActive={currentPageNumber == page.value}
										class={`${currentPageNumber === page.value ? ' rounded-lg border-primary bg-primary px-3 py-5' : ''}`}
									>
										<a href={buildUrlWithUpdatedPage(page.value)}>
											{page.value}
										</a>
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}

						<Pagination.Item>
							<Pagination.NextButton
								on:click={goToNextPage}
								disabled={currentPageNumber === Math.ceil(countSign / perPage)}
							>
								Próximo
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				</Pagination.Root>
			</div>
		{/if}