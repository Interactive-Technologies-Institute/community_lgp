import type { ModerationStatus } from '@/types/types';
import { Badge, BadgeCheck, BadgeInfo, BadgeX, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const typeMap: Record<ModerationStatus, { label: string; icon: ComponentType<Icon> }> = {
	pending: {
		label: 'Pendente',
		icon: Badge,
	},
	approved: {
		label: 'Aprovada',
		icon: BadgeCheck,
	},
	changes_requested: {
		label: 'Mudanças requisitadas',
		icon: BadgeInfo,
	},
	rejected: {
		label: 'Rejeitada',
		icon: BadgeX,
	},
};
