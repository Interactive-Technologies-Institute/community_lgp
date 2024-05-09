import type { DocGroup } from '@/index';

export async function load({ fetch }) {
	const response = await fetch('/api/academy/docs');
	const docs: DocGroup[] = await response.json();
	return { docs };
}
