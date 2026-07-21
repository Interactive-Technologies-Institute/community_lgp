<script lang="ts">
    import { Search } from 'lucide-svelte';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
    import { queryParam } from 'sveltekit-search-params';
	import { stringQueryParam } from '@/utils';

	const search = queryParam('s', stringQueryParam(), {
		debounceHistory: 250,
	});
    const page = queryParam('page', stringQueryParam());

    let localSearch: string = '';

    function doSearch() {
        search.set(localSearch);
        page.set('1');
    }
</script>

<div class="flex flex-1">
    <Input
        placeholder="Escreva uma palavra ou expressão para pesquisar..."
        class="flex flex-1 min-w-0 h-10 px-4 bg-brand-white border border-brand-border rounded-l-lg rounded-r-none truncate text-base placeholder:text-foreground/60"
        bind:value={localSearch}
        on:keydown={(e) => {
            if (e.key === 'Enter') doSearch();
        }}
    />
    <div class="flex justify-end">
        <Button class="rounded-l-none rounded-r-lg bg-brand-blue text-brand-white"
            on:click={doSearch}>
            <Search />
        </Button>
    </div>
</div>