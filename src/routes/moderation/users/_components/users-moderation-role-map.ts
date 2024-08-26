import type { UserRole } from '@/types/types';
import { Shield, ShieldPlus, SquareUser, type Icon } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const typeMap: Record<UserRole, { label: string; icon: ComponentType<Icon> }> = {
	user: {
		label: 'User',
		icon: SquareUser,
	},
	moderator: {
		label: 'Moderator',
		icon: Shield,
	},
	admin: {
		label: 'Admin',
		icon: ShieldPlus,
	},
};
