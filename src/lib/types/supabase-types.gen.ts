export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			branding: {
				Row: {
					color_theme: string;
					id: number;
					inserted_at: string;
					name: string;
					radius: number;
					slogan: string;
					updated_at: string;
				};
				Insert: {
					color_theme: string;
					id?: number;
					inserted_at?: string;
					name: string;
					radius: number;
					slogan: string;
					updated_at?: string;
				};
				Update: {
					color_theme?: string;
					id?: number;
					inserted_at?: string;
					name?: string;
					radius?: number;
					slogan?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			events: {
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
			events_interested: {
				Row: {
					event_id: number;
					id: number;
					inserted_at: string;
					user_id: string;
				};
				Insert: {
					event_id: number;
					id?: number;
					inserted_at?: string;
					user_id: string;
				};
				Update: {
					event_id?: number;
					id?: number;
					inserted_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'events_interested_event_id_fkey';
						columns: ['event_id'];
						isOneToOne: false;
						referencedRelation: 'events';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'events_interested_event_id_fkey';
						columns: ['event_id'];
						isOneToOne: false;
						referencedRelation: 'events_approved';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'events_interested_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			events_moderation: {
				Row: {
					comment: string;
					event_id: number;
					id: number;
					inserted_at: string;
					status: Database['public']['Enums']['moderation_status'];
					updated_at: string;
				};
				Insert: {
					comment: string;
					event_id: number;
					id?: number;
					inserted_at?: string;
					status: Database['public']['Enums']['moderation_status'];
					updated_at?: string;
				};
				Update: {
					comment?: string;
					event_id?: number;
					id?: number;
					inserted_at?: string;
					status?: Database['public']['Enums']['moderation_status'];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'events_moderation_event_id_fkey';
						columns: ['event_id'];
						isOneToOne: false;
						referencedRelation: 'events';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'events_moderation_event_id_fkey';
						columns: ['event_id'];
						isOneToOne: false;
						referencedRelation: 'events_approved';
						referencedColumns: ['id'];
					},
				];
			};
			feature_flags: {
				Row: {
					enabled: boolean;
					id: Database['public']['Enums']['feature'];
				};
				Insert: {
					enabled?: boolean;
					id: Database['public']['Enums']['feature'];
				};
				Update: {
					enabled?: boolean;
					id?: Database['public']['Enums']['feature'];
				};
				Relationships: [];
			};
			howtos: {
				Row: {
					description: string;
					difficulty: Database['public']['Enums']['how_to_difficulty'];
					duration: Database['public']['Enums']['how_to_duration'];
					id: number;
					image: string;
					inserted_at: string;
					steps: Json[];
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
					steps: Json[];
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
					steps?: Json[];
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
			howtos_moderation: {
				Row: {
					comment: string;
					howto_id: number;
					id: number;
					inserted_at: string;
					status: Database['public']['Enums']['moderation_status'];
					updated_at: string;
				};
				Insert: {
					comment: string;
					howto_id: number;
					id?: number;
					inserted_at?: string;
					status: Database['public']['Enums']['moderation_status'];
					updated_at?: string;
				};
				Update: {
					comment?: string;
					howto_id?: number;
					id?: number;
					inserted_at?: string;
					status?: Database['public']['Enums']['moderation_status'];
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'howtos_moderation_howto_id_fkey';
						columns: ['howto_id'];
						isOneToOne: false;
						referencedRelation: 'howtos';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'howtos_moderation_howto_id_fkey';
						columns: ['howto_id'];
						isOneToOne: false;
						referencedRelation: 'howtos_approved';
						referencedColumns: ['id'];
					},
				];
			};
			howtos_useful: {
				Row: {
					howto_id: number;
					id: number;
					inserted_at: string;
					user_id: string;
				};
				Insert: {
					howto_id: number;
					id?: number;
					inserted_at?: string;
					user_id: string;
				};
				Update: {
					howto_id?: number;
					id?: number;
					inserted_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'howtos_useful_howto_id_fkey';
						columns: ['howto_id'];
						isOneToOne: false;
						referencedRelation: 'howtos';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'howtos_useful_howto_id_fkey';
						columns: ['howto_id'];
						isOneToOne: false;
						referencedRelation: 'howtos_approved';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'howtos_useful_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			map_pins: {
				Row: {
					id: string;
					inserted_at: string;
					lat: number;
					lng: number;
					updated_at: string;
				};
				Insert: {
					id: string;
					inserted_at?: string;
					lat: number;
					lng: number;
					updated_at?: string;
				};
				Update: {
					id?: string;
					inserted_at?: string;
					lat?: number;
					lng?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'map_pins_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			map_pins_moderation: {
				Row: {
					comment: string;
					id: number;
					inserted_at: string;
					pin_id: string;
					status: Database['public']['Enums']['moderation_status'];
				};
				Insert: {
					comment: string;
					id?: number;
					inserted_at?: string;
					pin_id: string;
					status: Database['public']['Enums']['moderation_status'];
				};
				Update: {
					comment?: string;
					id?: number;
					inserted_at?: string;
					pin_id?: string;
					status?: Database['public']['Enums']['moderation_status'];
				};
				Relationships: [
					{
						foreignKeyName: 'map_pins_moderation_pin_id_fkey';
						columns: ['pin_id'];
						isOneToOne: false;
						referencedRelation: 'map_pins';
						referencedColumns: ['id'];
					},
				];
			};
			profiles: {
				Row: {
					description: string;
					display_name: string;
					email: string;
					id: string;
					image: string | null;
					inserted_at: string;
					type: string;
					updated_at: string;
				};
				Insert: {
					description?: string;
					display_name?: string;
					email: string;
					id: string;
					image?: string | null;
					inserted_at?: string;
					type: string;
					updated_at?: string;
				};
				Update: {
					description?: string;
					display_name?: string;
					email?: string;
					id?: string;
					image?: string | null;
					inserted_at?: string;
					type?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'profiles_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			role_permissions: {
				Row: {
					id: number;
					permission: Database['public']['Enums']['user_permission'];
					role: Database['public']['Enums']['user_role'];
				};
				Insert: {
					id?: number;
					permission: Database['public']['Enums']['user_permission'];
					role: Database['public']['Enums']['user_role'];
				};
				Update: {
					id?: number;
					permission?: Database['public']['Enums']['user_permission'];
					role?: Database['public']['Enums']['user_role'];
				};
				Relationships: [];
			};
			user_roles: {
				Row: {
					id: number;
					role: Database['public']['Enums']['user_role'];
					user_id: string;
				};
				Insert: {
					id?: number;
					role: Database['public']['Enums']['user_role'];
					user_id: string;
				};
				Update: {
					id?: number;
					role?: Database['public']['Enums']['user_role'];
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_roles_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			user_types: {
				Row: {
					is_default: boolean;
					label: string;
					slug: string;
				};
				Insert: {
					is_default?: boolean;
					label: string;
					slug: string;
				};
				Update: {
					is_default?: boolean;
					label?: string;
					slug?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			events_approved: {
				Row: {
					date: string | null;
					description: string | null;
					id: number | null;
					image: string | null;
					inserted_at: string | null;
					location: string | null;
					tags: string[] | null;
					title: string | null;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					date?: string | null;
					description?: string | null;
					id?: number | null;
					image?: string | null;
					inserted_at?: string | null;
					location?: string | null;
					tags?: string[] | null;
					title?: string | null;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					date?: string | null;
					description?: string | null;
					id?: number | null;
					image?: string | null;
					inserted_at?: string | null;
					location?: string | null;
					tags?: string[] | null;
					title?: string | null;
					updated_at?: string | null;
					user_id?: string | null;
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
			howtos_approved: {
				Row: {
					description: string | null;
					difficulty: Database['public']['Enums']['how_to_difficulty'] | null;
					duration: Database['public']['Enums']['how_to_duration'] | null;
					id: number | null;
					image: string | null;
					inserted_at: string | null;
					steps: Json[] | null;
					tags: string[] | null;
					title: string | null;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					description?: string | null;
					difficulty?: Database['public']['Enums']['how_to_difficulty'] | null;
					duration?: Database['public']['Enums']['how_to_duration'] | null;
					id?: number | null;
					image?: string | null;
					inserted_at?: string | null;
					steps?: Json[] | null;
					tags?: string[] | null;
					title?: string | null;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					description?: string | null;
					difficulty?: Database['public']['Enums']['how_to_difficulty'] | null;
					duration?: Database['public']['Enums']['how_to_duration'] | null;
					id?: number | null;
					image?: string | null;
					inserted_at?: string | null;
					steps?: Json[] | null;
					tags?: string[] | null;
					title?: string | null;
					updated_at?: string | null;
					user_id?: string | null;
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
		};
		Functions: {
			authorize: {
				Args: {
					requested_permission: Database['public']['Enums']['user_permission'];
				};
				Returns: boolean;
			};
			custom_access_token_hook: {
				Args: {
					event: Json;
				};
				Returns: Json;
			};
			get_event_interest_count: {
				Args: {
					event_id: number;
					user_id?: string;
				};
				Returns: {
					count: number;
					has_interest: boolean;
				}[];
			};
			get_howto_useful_count: {
				Args: {
					howto_id: number;
					user_id?: string;
				};
				Returns: {
					count: number;
					has_useful: boolean;
				}[];
			};
			update_user_types: {
				Args: {
					types: Database['public']['CompositeTypes']['user_type'][];
				};
				Returns: undefined;
			};
		};
		Enums: {
			feature: 'howtos' | 'events' | 'map' | 'academy';
			how_to_difficulty: 'easy' | 'medium' | 'hard';
			how_to_duration: 'short' | 'medium' | 'long';
			moderation_status: 'pending' | 'changes_requested' | 'approved' | 'rejected';
			user_permission:
				| 'howtos.create'
				| 'howtos.update'
				| 'howtos.delete'
				| 'howtos.moderate'
				| 'events.create'
				| 'events.update'
				| 'events.delete'
				| 'events.moderate'
				| 'map.create'
				| 'map.update'
				| 'map.delete'
				| 'map.moderate'
				| 'features.update'
				| 'branding.update'
				| 'user_types.update';
			user_role: 'user' | 'moderator' | 'admin';
		};
		CompositeTypes: {
			user_type: {
				slug: string | null;
				label: string | null;
				is_default: boolean | null;
			};
		};
	};
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null;
					avif_autodetection: boolean | null;
					created_at: string | null;
					file_size_limit: number | null;
					id: string;
					name: string;
					owner: string | null;
					owner_id: string | null;
					public: boolean | null;
					updated_at: string | null;
				};
				Insert: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id: string;
					name: string;
					owner?: string | null;
					owner_id?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Update: {
					allowed_mime_types?: string[] | null;
					avif_autodetection?: boolean | null;
					created_at?: string | null;
					file_size_limit?: number | null;
					id?: string;
					name?: string;
					owner?: string | null;
					owner_id?: string | null;
					public?: boolean | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			migrations: {
				Row: {
					executed_at: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Insert: {
					executed_at?: string | null;
					hash: string;
					id: number;
					name: string;
				};
				Update: {
					executed_at?: string | null;
					hash?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			objects: {
				Row: {
					bucket_id: string | null;
					created_at: string | null;
					id: string;
					last_accessed_at: string | null;
					metadata: Json | null;
					name: string | null;
					owner: string | null;
					owner_id: string | null;
					path_tokens: string[] | null;
					updated_at: string | null;
					version: string | null;
				};
				Insert: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					owner_id?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Update: {
					bucket_id?: string | null;
					created_at?: string | null;
					id?: string;
					last_accessed_at?: string | null;
					metadata?: Json | null;
					name?: string | null;
					owner?: string | null;
					owner_id?: string | null;
					path_tokens?: string[] | null;
					updated_at?: string | null;
					version?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'objects_bucketId_fkey';
						columns: ['bucket_id'];
						isOneToOne: false;
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					},
				];
			};
			s3_multipart_uploads: {
				Row: {
					bucket_id: string;
					created_at: string;
					id: string;
					in_progress_size: number;
					key: string;
					owner_id: string | null;
					upload_signature: string;
					version: string;
				};
				Insert: {
					bucket_id: string;
					created_at?: string;
					id: string;
					in_progress_size?: number;
					key: string;
					owner_id?: string | null;
					upload_signature: string;
					version: string;
				};
				Update: {
					bucket_id?: string;
					created_at?: string;
					id?: string;
					in_progress_size?: number;
					key?: string;
					owner_id?: string | null;
					upload_signature?: string;
					version?: string;
				};
				Relationships: [
					{
						foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
						columns: ['bucket_id'];
						isOneToOne: false;
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					},
				];
			};
			s3_multipart_uploads_parts: {
				Row: {
					bucket_id: string;
					created_at: string;
					etag: string;
					id: string;
					key: string;
					owner_id: string | null;
					part_number: number;
					size: number;
					upload_id: string;
					version: string;
				};
				Insert: {
					bucket_id: string;
					created_at?: string;
					etag: string;
					id?: string;
					key: string;
					owner_id?: string | null;
					part_number: number;
					size?: number;
					upload_id: string;
					version: string;
				};
				Update: {
					bucket_id?: string;
					created_at?: string;
					etag?: string;
					id?: string;
					key?: string;
					owner_id?: string | null;
					part_number?: number;
					size?: number;
					upload_id?: string;
					version?: string;
				};
				Relationships: [
					{
						foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
						columns: ['bucket_id'];
						isOneToOne: false;
						referencedRelation: 'buckets';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
						columns: ['upload_id'];
						isOneToOne: false;
						referencedRelation: 's3_multipart_uploads';
						referencedColumns: ['id'];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string;
					name: string;
					owner: string;
					metadata: Json;
				};
				Returns: undefined;
			};
			extension: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			filename: {
				Args: {
					name: string;
				};
				Returns: string;
			};
			foldername: {
				Args: {
					name: string;
				};
				Returns: string[];
			};
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size: number;
					bucket_id: string;
				}[];
			};
			list_multipart_uploads_with_delimiter: {
				Args: {
					bucket_id: string;
					prefix_param: string;
					delimiter_param: string;
					max_keys?: number;
					next_key_token?: string;
					next_upload_token?: string;
				};
				Returns: {
					key: string;
					id: string;
					created_at: string;
				}[];
			};
			list_objects_with_delimiter: {
				Args: {
					bucket_id: string;
					prefix_param: string;
					delimiter_param: string;
					max_keys?: number;
					start_after?: string;
					next_token?: string;
				};
				Returns: {
					name: string;
					id: string;
					metadata: Json;
					updated_at: string;
				}[];
			};
			search: {
				Args: {
					prefix: string;
					bucketname: string;
					limits?: number;
					levels?: number;
					offsets?: number;
					search?: string;
					sortcolumn?: string;
					sortorder?: string;
				};
				Returns: {
					name: string;
					id: string;
					updated_at: string;
					created_at: string;
					last_accessed_at: string;
					metadata: Json;
				}[];
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;
