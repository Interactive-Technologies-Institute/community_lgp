import type { User } from '@supabase/supabase-js';

export type Feature =
	| 'annotate'
	| 'crowdsource'
	| 'dictionary'
	| 'fcdictionary'
	| 'map'
	| 'guides'
	| 'events'
	| 'docs'
	| 'lgp4fun';

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
	annotation: AnnotationArray;
	annotation_array: number[];
	created_at: string;
	id: number;
	is_anotated: 0 | 1 | 2;
	last_changed: string;
	name: string;
	theme: string[];
	video: string;
	description?: string | null;
	context_video?: string | null;
	sentence?: string | null;
	frequency: 0 | 1 | 2;
	district?: string | null;
	image?: string | null;
};

export type AnnotationArray = {
	configuration: number[];
	movement: number[];
	location: number[];
	orientation: number[];
	expression: number[];
};

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

export type CSProposal = {
	id: number;
	user_id: string;
	title: string;
	content_text?: string | null; 
	content_video?: string | null;
	tags: string[];
	created_at: string;
	last_edited_at: string;
	is_locked: boolean;
}

export type CSComment = {
	id: number;
	user_id: string; 
	parent_id: number;
	proposal_id: number;
	content_text?: string | null;
	content_video?: string | null;
	created_at: string;
	last_edited_at: string;
	include_in_proposal: boolean;
}