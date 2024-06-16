<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { mapPinSchema, type MapPinSchema } from '@/schemas/map-pin';
	import { Check, MapPin, XCircle } from 'lucide-svelte';
	import { getContext, onDestroy } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { key, mapboxgl, type MBMapContext } from './mapbox';

	const { getMap } = getContext<MBMapContext>(key);

	export let data: SuperValidated<Infer<MapPinSchema>>;

	const form = superForm(data, {
		taintedMessage: true,
		validators: zodClient(mapPinSchema),
	});

	const { form: formData, enhance } = form;

	let markerElement: HTMLElement;
	let marker: mapboxgl.Marker | undefined;

	function onDragEnd() {
		if (marker) {
			const lngLat = marker.getLngLat();
			$formData.lng = lngLat.lng;
			$formData.lat = lngLat.lat;
		}
	}

	function initializePin() {
		const map = getMap();
		if (map) {
			let lngLat = data.data ?? map.getCenter();
			marker = new mapboxgl.Marker(markerElement, {
				draggable: true,
			})
				.setLngLat(lngLat)
				.addTo(map);
			marker.on('dragend', onDragEnd);
			map?.flyTo({
				center: lngLat,
				zoom: 6,
			});
		}
	}

	function confirmPin() {
		marker?.remove();
		marker = undefined;
	}

	function cancelPin() {
		marker?.remove();
		marker = undefined;
	}

	onDestroy(() => {
		marker?.remove();
		marker = undefined;
	});
</script>

<div bind:this={markerElement} class="flex flex-col items-center">
	{#if marker}
		<div class="mb-2 rounded-sm bg-primary px-2 py-1 text-primary-foreground">
			Drag the pin to your location
		</div>
		<div
			class="mb-8 h-10 w-10 overflow-hidden rounded-full border-2 border-foreground bg-foreground"
		>
			<img src="/avatars/user.png" alt="User avatar" class="aspect-square h-full w-full" />
		</div>
	{/if}
</div>

{#if marker}
	<form method="POST" use:enhance action="/map" on:submit={confirmPin}>
		<input type="hidden" name="lng" bind:value={$formData.lng} />
		<input type="hidden" name="lat" bind:value={$formData.lat} />
		<div class="flex flex-row gap-x-2">
			<Button on:click={cancelPin}>
				<XCircle class="mr-2 h-4 w-4" />
				Cancel
			</Button>
			<Button type="submit">
				<Check class="mr-2 h-4 w-4" />
				Confirm
			</Button>
		</div>
	</form>
	<Button variant="destructive">
		<XCircle class="mr-2 h-4 w-4" />
		Remove Pin
	</Button>
{:else}
	<Button on:click={initializePin}>
		<MapPin class="mr-2 h-4 w-4" />
		Edit my pin
	</Button>
{/if}
