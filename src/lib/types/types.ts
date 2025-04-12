import type { User } from '@supabase/supabase-js';

export type Feature = 'annotate' |'dictionary' | 'fcdictionary' | 'map' | 'guides' | 'events' | 'docs';

export type UserRole = 'user' | 'moderator' | 'admin';

export type UserWithRole = User & { role: UserRole };

export type UserProfile = {
	id: string;
	inserted_at: string;
	updated_at: string;
	role: UserRole;
	type: string;
	email: string;
	display_name: string;
	description: string | null;
	avatar: string | null;
};

export type UserType = {
	slug: string;
	label: string;
	is_default: boolean;
};

export type Branding = {
	name: string;
	slogan: string;
	logo?: string | null;
	color_theme: string;
	radius: number;
};

export type ModerationStatus = 'pending' | 'approved' | 'changes_requested' | 'rejected';

export type ModerationInfo = {
	status: ModerationStatus;
	inserted_at: string;
	comment: string;
};

export type MapPin = {
	id: number;
	inserted_at: string;
	updated_at: string;
	user_id: string;
	lng: number;
	lat: number;
	moderation_status: ModerationStatus;
};

export type MapPinWithModeration = MapPin & { moderation: ModerationInfo[] };

export type UserProfileWithPin = UserProfile & { pin: MapPin | null };

export type GuideDifficulty = 'easy' | 'medium' | 'hard';

export type GuideDuration = 'short' | 'medium' | 'long';

export type Guide = {
	id: number;
	inserted_at: string;
	updated_at: string;
	user_id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	difficulty: GuideDifficulty;
	duration: GuideDuration;
	steps: GuideStep[];
	moderation_status: ModerationStatus;
};

export type GuideWithAuthor = Guide & { author: UserProfile };

export type GuideWithModeration = Guide & { moderation: ModerationInfo[] };

type GuideStep = {
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
	inserted_at: string;
	updated_at: string;
	user_id: string;
	title: string;
	description: string;
	tags: string[];
	image: string;
	date: string;
	location: string;
	moderation_status: ModerationStatus;
};

export type EventWithAuthor = Event & { author: UserProfile };

export type EventWithModeration = Event & { moderation: ModerationInfo[] };

export type NotificationType =
	| 'guide_pending'
	| 'guide_changes_requested'
	| 'guide_approved'
	| 'guide_rejected'
	| 'event_pending'
	| 'event_changes_requested'
	| 'event_approved'
	| 'event_rejected'
	| 'map_pin_pending'
	| 'map_pin_changes_requested'
	| 'map_pin_approved'
	| 'map_pin_rejected';

export type Notification = {
	id: number;
	inserted_at: string;
	user_id: string;
	type: NotificationType;
	data: Record<string, string>;
	read: boolean;
};

export type Sign = {
	anotated: string | "";
	annotation: AnnotationArray | null;
	annotation_array: number[];
	created_at: string;
	id: number;
	is_anotated: number;
	last_changed: string;
	name: string;
	selected: string | null;
	theme: string[];
	video: string;
	written_anotation?: {
		configuration: string;
		movement: string[];
		orientation: string[];
	}| null;
	description?: string | null;
	context_video?: string | null;
	sentence?: string | null;
};

export type AnnotationArray = {
	configuration: string[];
	movement: string[];
	location: string[];
	orientation: string[];
	expression: string[];
} 

export type Parameter = {
	id: number;
	tipo: string | null;
	code: string | null;
	name: string | null;
	is_parent: boolean | null;
	children: string[] | null;
	parent: string | null;
	image: string | null;
};