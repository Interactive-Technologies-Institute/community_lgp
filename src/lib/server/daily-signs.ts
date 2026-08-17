import type { Sign } from '@/types/types';

function getLisbonDayKey() {
	return new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/Lisbon',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date());
}

function hashString(value: string) {
	let hash = 2166136261;

	for (let index = 0; index < value.length; index += 1) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}

	return hash >>> 0;
}

export function selectDailySigns(signs: Sign[], dictionary: 'general' | 'first-cycle', count = 6) {
	const shuffledSigns = [...signs];
	let state = hashString(`${getLisbonDayKey()}-${dictionary}`);
	const random = () => {
		state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
		return state / 4294967296;
	};

	for (let index = shuffledSigns.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(random() * (index + 1));
		[shuffledSigns[index], shuffledSigns[randomIndex]] = [
			shuffledSigns[randomIndex],
			shuffledSigns[index],
		];
	}

	return shuffledSigns.slice(0, count);
}
