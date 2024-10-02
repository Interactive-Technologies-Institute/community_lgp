<script lang="ts">
	import { getContext } from 'svelte';
	import { key, mapboxgl, type MBMapContext } from './mapbox';

	const { getMap } = getContext<MBMapContext>(key);

	export let lng: number;
	export let lat: number;

	let marker: mapboxgl.Marker | undefined;

	$: if (marker) {
		marker.setLngLat([lng, lat]);
	}

	function initialize(node: HTMLElement) {
		const map = getMap();

		if (map) {
			marker = new mapboxgl.Marker(node).setLngLat([lng, lat]).addTo(map);
		}

		return {
			destroy() {
				marker?.remove();
				marker = undefined;
			},
		};
	}

	function initializePopup(node: HTMLElement) {
		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false,
			anchor: 'bottom',
			offset: 40,
			maxWidth: '100%',
		}).setDOMContent(node);
		marker?.setPopup(popup);
	}
</script>

<div use:initialize>
	{#if marker}
		<slot />
	{/if}
</div>

<div use:initializePopup>
	<slot name="popup" />
</div>

<style>
	:global(.mapboxgl-popup-content) {
		background: transparent;
		border-radius: 0;
		box-shadow: none;
		padding: 0;
	}

	:global(.mapboxgl-popup-tip) {
		display: none;
	}
</style>
