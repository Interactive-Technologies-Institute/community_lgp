import type { DocGroup } from '@/types/types';

export async function load({ fetch }) {
	const response = await fetch('/api/docs');
	const docs: DocGroup[] = await response.json();
	return { docs };
}
