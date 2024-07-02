import type { MergeDeep } from 'type-fest';
import type { Database as DatabaseGenerated } from './supabase-types.gen.ts';

type Step = { title: string; description: string; image: string };

export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Tables: {
				howtos: {
					Row: {
						steps: Step[];
					};
					Insert: {
						steps: Step[];
					};
					Update: {
						steps?: Step[];
					};
				};
			};
			Views: {
				events_view: {
					Row: {
						date: string;
						description: string;
						id: number;
						image: string;
						inserted_at: string;
						location: string;
						tags: string[];
						title: string;
						updated_at: string;
						user_id: string;
					};
					Insert: {
						date: string;
						description: string;
						id?: number;
						image: string;
						inserted_at?: string;
						location: string;
						tags: string[];
						title: string;
						updated_at?: string;
						user_id: string;
					};
					Update: {
						date?: string;
						description?: string;
						id?: number;
						image?: string;
						inserted_at?: string;
						location?: string;
						tags?: string[];
						title?: string;
						updated_at?: string;
						user_id?: string;
					};
					Relationships: [
						{
							foreignKeyName: 'events_user_id_fkey';
							columns: ['user_id'];
							isOneToOne: false;
							referencedRelation: 'profiles';
							referencedColumns: ['id'];
						},
					];
				};
				events_tags: {
					Row: {
						count: number;
						tag: string;
					};
					Relationships: [];
				};
				howtos_view: {
					Row: {
						description: string;
						difficulty: Database['public']['Enums']['how_to_difficulty'];
						duration: Database['public']['Enums']['how_to_duration'];
						id: number;
						image: string;
						inserted_at: string;
						steps: Step[];
						tags: string[];
						title: string;
						updated_at: string;
						user_id: string;
					};
					Insert: {
						description: string;
						difficulty: Database['public']['Enums']['how_to_difficulty'];
						duration: Database['public']['Enums']['how_to_duration'];
						id?: number;
						image: string;
						inserted_at?: string;
						steps: Step[];
						tags: string[];
						title: string;
						updated_at?: string;
						user_id: string;
					};
					Update: {
						description?: string;
						difficulty?: Database['public']['Enums']['how_to_difficulty'];
						duration?: Database['public']['Enums']['how_to_duration'];
						id?: number;
						image?: string;
						inserted_at?: string;
						steps?: Step[];
						tags?: string[];
						title?: string;
						updated_at?: string;
						user_id?: string;
					};
					Relationships: [
						{
							foreignKeyName: 'howtos_user_id_fkey';
							columns: ['user_id'];
							isOneToOne: false;
							referencedRelation: 'profiles';
							referencedColumns: ['id'];
						},
					];
				};
				howtos_tags: {
					Row: {
						count: number;
						tag: string;
					};
					Relationships: [];
				};
			};
		};
	}
>;
