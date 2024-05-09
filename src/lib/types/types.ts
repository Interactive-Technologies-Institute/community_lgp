import type { User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'moderator' | 'admin';

export type UserWithRole = User & { role: UserRole };

export type UserProfile = {
	id: string;
	email: string;
	type: string;
	display_name: string;
	description: string;
	image: string | null;
};

export type MapPin = {
	lng: number;
	lat: number;
};

export type UserProfileWithPin = UserProfile & { pin: MapPin | null };

export type HowToDifficulty = 'easy' | 'medium' | 'hard';

export type HowToDuration = 'short' | 'medium' | 'long';

export type HowTo = {
	id: number;
	user_id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	difficulty: HowToDifficulty;
	duration: HowToDuration;
	steps: HowToStep[];
};

type HowToStep = {
	title: string;
	description: string;
	image: string;
};

export type Doc = {
	slug: string;
	title: string;
};

export type DocGroup = {
	slug: string;
	title: string;
	docs: Doc[];
};

export type Event = {
	id: number;
	user_id: string;
	title: string;
	description: string;
	tags: string[];
	image: string;
	date: string;
	location: string;
};
