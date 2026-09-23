// MOCK/SCRIPTED FOR PROMO VIDEO: UI-only state shared between VideoSearch.svelte (which
// owns the fake recording/processing state machine) and DictionaryView.svelte /
// DictionaryGrid.svelte, so the results area below the search panel knows whether to show
// a skeleton grid ("processing") or the highlighted "best match" layout ("results"). No
// real data, ML, or backend logic flows through this store — see VideoSearch.svelte.
import { writable } from 'svelte/store';

export type VideoSearchStage = 'idle' | 'processing' | 'results';

export const videoSearchStage = writable<VideoSearchStage>('idle');
