export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      branding: {
        Row: {
          color_theme: string
          id: number
          inserted_at: string
          logo: string | null
          name: string
          radius: number
          slogan: string
          updated_at: string
        }
        Insert: {
          color_theme: string
          id?: number
          inserted_at?: string
          logo?: string | null
          name: string
          radius: number
          slogan: string
          updated_at?: string
        }
        Update: {
          color_theme?: string
          id?: number
          inserted_at?: string
          logo?: string | null
          name?: string
          radius?: number
          slogan?: string
          updated_at?: string
        }
        Relationships: []
      }
      crowdsource_comments: {
        Row: {
          content_text: string | null
          content_video: string | null
          created_at: string | null
          id: number
          last_edited_at: string | null
          parent_id: number | null
          sign_id: number | null
          user_id: string | null
        }
        Insert: {
          content_text?: string | null
          content_video?: string | null
          created_at?: string | null
          id?: number
          last_edited_at?: string | null
          parent_id?: number | null
          sign_id?: number | null
          user_id?: string | null
        }
        Update: {
          content_text?: string | null
          content_video?: string | null
          created_at?: string | null
          id?: number
          last_edited_at?: string | null
          parent_id?: number | null
          sign_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "crowdsource_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crowdsource_comments_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crowdsource_comments_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crowdsource_comments_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crowdsource_comments_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_view"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          date: string
          description: string
          fts: unknown | null
          id: number
          image: string
          inserted_at: string
          location: string
          tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          date: string
          description: string
          fts?: unknown | null
          id?: number
          image: string
          inserted_at?: string
          location: string
          tags: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          date?: string
          description?: string
          fts?: unknown | null
          id?: number
          image?: string
          inserted_at?: string
          location?: string
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      events_interested: {
        Row: {
          event_id: number
          id: number
          inserted_at: string
          user_id: string
        }
        Insert: {
          event_id: number
          id?: number
          inserted_at?: string
          user_id: string
        }
        Update: {
          event_id?: number
          id?: number
          inserted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_interested_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_interested_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_interested_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_interested_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      events_moderation: {
        Row: {
          comment: string
          event_id: number
          id: number
          inserted_at: string
          status: Database["public"]["Enums"]["moderation_status"]
          user_id: string
        }
        Insert: {
          comment: string
          event_id: number
          id?: number
          inserted_at?: string
          status: Database["public"]["Enums"]["moderation_status"]
          user_id: string
        }
        Update: {
          comment?: string
          event_id?: number
          id?: number
          inserted_at?: string
          status?: Database["public"]["Enums"]["moderation_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_moderation_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_moderation_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          enabled: boolean
          id: Database["public"]["Enums"]["feature"]
        }
        Insert: {
          enabled?: boolean
          id: Database["public"]["Enums"]["feature"]
        }
        Update: {
          enabled?: boolean
          id?: Database["public"]["Enums"]["feature"]
        }
        Relationships: []
      }
      guides: {
        Row: {
          description: string
          difficulty: Database["public"]["Enums"]["guide_difficulty"]
          duration: Database["public"]["Enums"]["guide_duration"]
          fts: unknown | null
          id: number
          image: string
          inserted_at: string
          steps: Json[]
          tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          description: string
          difficulty: Database["public"]["Enums"]["guide_difficulty"]
          duration: Database["public"]["Enums"]["guide_duration"]
          fts?: unknown | null
          id?: number
          image: string
          inserted_at?: string
          steps: Json[]
          tags: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          description?: string
          difficulty?: Database["public"]["Enums"]["guide_difficulty"]
          duration?: Database["public"]["Enums"]["guide_duration"]
          fts?: unknown | null
          id?: number
          image?: string
          inserted_at?: string
          steps?: Json[]
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      guides_moderation: {
        Row: {
          comment: string
          guide_id: number
          id: number
          inserted_at: string
          status: Database["public"]["Enums"]["moderation_status"]
          user_id: string
        }
        Insert: {
          comment: string
          guide_id: number
          id?: number
          inserted_at?: string
          status: Database["public"]["Enums"]["moderation_status"]
          user_id: string
        }
        Update: {
          comment?: string
          guide_id?: number
          id?: number
          inserted_at?: string
          status?: Database["public"]["Enums"]["moderation_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guides_moderation_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_moderation_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      guides_useful: {
        Row: {
          guide_id: number
          id: number
          inserted_at: string
          user_id: string
        }
        Insert: {
          guide_id: number
          id?: number
          inserted_at?: string
          user_id: string
        }
        Update: {
          guide_id?: number
          id?: number
          inserted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guides_useful_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_useful_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_useful_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_useful_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      map_pins: {
        Row: {
          id: number
          inserted_at: string
          lat: number
          lng: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: number
          inserted_at?: string
          lat: number
          lng: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: number
          inserted_at?: string
          lat?: number
          lng?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_pins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      map_pins_moderation: {
        Row: {
          comment: string
          id: number
          inserted_at: string
          map_pin_id: number
          status: Database["public"]["Enums"]["moderation_status"]
          user_id: string
        }
        Insert: {
          comment: string
          id?: number
          inserted_at?: string
          map_pin_id: number
          status: Database["public"]["Enums"]["moderation_status"]
          user_id: string
        }
        Update: {
          comment?: string
          id?: number
          inserted_at?: string
          map_pin_id?: number
          status?: Database["public"]["Enums"]["moderation_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "map_pins_moderation_map_pin_id_fkey"
            columns: ["map_pin_id"]
            isOneToOne: false
            referencedRelation: "map_pins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_moderation_map_pin_id_fkey"
            columns: ["map_pin_id"]
            isOneToOne: false
            referencedRelation: "map_pins_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          data: Json
          id: number
          inserted_at: string
          read: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          data?: Json
          id?: number
          inserted_at?: string
          read?: boolean
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          data?: Json
          id?: number
          inserted_at?: string
          read?: boolean
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      parameters: {
        Row: {
          children: string[] | null
          code: string | null
          id: number
          image: string | null
          is_parent: boolean | null
          name: string | null
          parent: string | null
          tipo: string | null
        }
        Insert: {
          children?: string[] | null
          code?: string | null
          id: number
          image?: string | null
          is_parent?: boolean | null
          name?: string | null
          parent?: string | null
          tipo?: string | null
        }
        Update: {
          children?: string[] | null
          code?: string | null
          id?: number
          image?: string | null
          is_parent?: boolean | null
          name?: string | null
          parent?: string | null
          tipo?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar: string | null
          cnum: string | null
          description: string | null
          display_name: string
          email: string
          gender: string | null
          id: string
          inserted_at: string
          language: string | null
          profession: string | null
          sign_name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          age?: number | null
          avatar?: string | null
          cnum?: string | null
          description?: string | null
          display_name: string
          email: string
          gender?: string | null
          id: string
          inserted_at?: string
          language?: string | null
          profession?: string | null
          sign_name?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          age?: number | null
          avatar?: string | null
          cnum?: string | null
          description?: string | null
          display_name?: string
          email?: string
          gender?: string | null
          id?: string
          inserted_at?: string
          language?: string | null
          profession?: string | null
          sign_name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["user_permission"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["user_permission"]
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["user_permission"]
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      signs: {
        Row: {
          annotated_by_user_id: string | null
          annotation: Json | null
          annotation_array: number[] | null
          context_video: string | null
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          district: string | null
          frequency: number | null
          game_video: string | null
          id: number
          image: string | null
          is_anotated: number | null
          last_changed: string | null
          main_sign_id: number | null
          name: string | null
          sentence: string | null
          theme: string[] | null
          theme_flattened: string | null
          video: string | null
        }
        Insert: {
          annotated_by_user_id?: string | null
          annotation?: Json | null
          annotation_array?: number[] | null
          context_video?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          district?: string | null
          frequency?: number | null
          game_video?: string | null
          id?: number
          image?: string | null
          is_anotated?: number | null
          last_changed?: string | null
          main_sign_id?: number | null
          name?: string | null
          sentence?: string | null
          theme?: string[] | null
          theme_flattened?: string | null
          video?: string | null
        }
        Update: {
          annotated_by_user_id?: string | null
          annotation?: Json | null
          annotation_array?: number[] | null
          context_video?: string | null
          created_at?: string | null
          created_by_user_id?: string | null
          description?: string | null
          district?: string | null
          frequency?: number | null
          game_video?: string | null
          id?: number
          image?: string | null
          is_anotated?: number | null
          last_changed?: string | null
          main_sign_id?: number | null
          name?: string | null
          sentence?: string | null
          theme?: string[] | null
          theme_flattened?: string | null
          video?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signs_main_sign_id_fkey"
            columns: ["main_sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_main_sign_id_fkey"
            columns: ["main_sign_id"]
            isOneToOne: false
            referencedRelation: "signs_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_main_sign_id_fkey"
            columns: ["main_sign_id"]
            isOneToOne: false
            referencedRelation: "signs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_main_sign_id_fkey"
            columns: ["main_sign_id"]
            isOneToOne: false
            referencedRelation: "signs_view"
            referencedColumns: ["id"]
          },
        ]
      }
      signs_favorite: {
        Row: {
          id: number
          inserted_at: string
          sign_id: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          inserted_at?: string
          sign_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          inserted_at?: string
          sign_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signs_favorite_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_favorite_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_favorite_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_favorite_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_view"
            referencedColumns: ["id"]
          },
        ]
      }
      signs_moderation: {
        Row: {
          comment: string | null
          created_by_user_id: string | null
          id: number
          inserted_at: string
          sign_id: number | null
          status: Database["public"]["Enums"]["moderation_status"] | null
        }
        Insert: {
          comment?: string | null
          created_by_user_id?: string | null
          id?: number
          inserted_at?: string
          sign_id?: number | null
          status?: Database["public"]["Enums"]["moderation_status"] | null
        }
        Update: {
          comment?: string | null
          created_by_user_id?: string | null
          id?: number
          inserted_at?: string
          sign_id?: number | null
          status?: Database["public"]["Enums"]["moderation_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "signs_moderation_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_view"
            referencedColumns: ["id"]
          },
        ]
      }
      signs_rating: {
        Row: {
          id: number
          inserted_at: string
          sign_id: number | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          id?: number
          inserted_at?: string
          sign_id?: number | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          id?: number
          inserted_at?: string
          sign_id?: number | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "signs_rating_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_rating_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_rating_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_rating_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_view"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      user_types: {
        Row: {
          is_default: boolean
          label: string
          slug: string
        }
        Insert: {
          is_default?: boolean
          label: string
          slug: string
        }
        Update: {
          is_default?: boolean
          label?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      events_tags: {
        Row: {
          count: number | null
          tag: string | null
        }
        Relationships: []
      }
      events_view: {
        Row: {
          date: string | null
          description: string | null
          fts: unknown | null
          id: number | null
          image: string | null
          inserted_at: string | null
          location: string | null
          moderation_status:
            | Database["public"]["Enums"]["moderation_status"]
            | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      guides_tags: {
        Row: {
          count: number | null
          tag: string | null
        }
        Relationships: []
      }
      guides_view: {
        Row: {
          description: string | null
          difficulty: Database["public"]["Enums"]["guide_difficulty"] | null
          duration: Database["public"]["Enums"]["guide_duration"] | null
          fts: unknown | null
          id: number | null
          image: string | null
          inserted_at: string | null
          moderation_status:
            | Database["public"]["Enums"]["moderation_status"]
            | null
          steps: Json[] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      latest_events_moderation: {
        Row: {
          comment: string | null
          event_id: number | null
          id: number | null
          inserted_at: string | null
          status: Database["public"]["Enums"]["moderation_status"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_moderation_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_moderation_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      latest_guides_moderation: {
        Row: {
          comment: string | null
          guide_id: number | null
          id: number | null
          inserted_at: string | null
          status: Database["public"]["Enums"]["moderation_status"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guides_moderation_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_moderation_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guides_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      latest_map_pins_moderation: {
        Row: {
          comment: string | null
          id: number | null
          inserted_at: string | null
          map_pin_id: number | null
          status: Database["public"]["Enums"]["moderation_status"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "map_pins_moderation_map_pin_id_fkey"
            columns: ["map_pin_id"]
            isOneToOne: false
            referencedRelation: "map_pins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_moderation_map_pin_id_fkey"
            columns: ["map_pin_id"]
            isOneToOne: false
            referencedRelation: "map_pins_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_moderation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      latest_signs_moderation: {
        Row: {
          comment: string | null
          id: number | null
          inserted_at: string | null
          sign_id: number | null
          status: Database["public"]["Enums"]["moderation_status"] | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signs_moderation_created_by_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_created_by_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_moderation_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_view"
            referencedColumns: ["id"]
          },
        ]
      }
      map_pins_view: {
        Row: {
          id: number | null
          inserted_at: string | null
          lat: number | null
          lng: number | null
          moderation_status:
            | Database["public"]["Enums"]["moderation_status"]
            | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "map_pins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "map_pins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles_view"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_view: {
        Row: {
          age: number | null
          avatar: string | null
          cnum: string | null
          description: string | null
          display_name: string | null
          email: string | null
          gender: string | null
          id: string | null
          inserted_at: string | null
          language: string | null
          profession: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          sign_name: string | null
          type: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      signs_favorite_view: {
        Row: {
          id: number | null
          inserted_at: string | null
          name: string | null
          sign_id: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signs_favorite_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_favorite_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_favorite_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_favorite_sign_id_fkey"
            columns: ["sign_id"]
            isOneToOne: false
            referencedRelation: "signs_view"
            referencedColumns: ["id"]
          },
        ]
      }
      signs_statistics: {
        Row: {
          created_by_user_id: string | null
          id: number | null
          name: string | null
          neg_votes: number | null
          nt_votes: number | null
          pos_votes: number | null
          theme: string[] | null
          theme_flattened: string | null
          video: string | null
        }
        Relationships: []
      }
      signs_summary: {
        Row: {
          created_at: string | null
          created_by_user_id: string | null
          id: number | null
          name: string | null
          negative_votes: number | null
          positive_votes: number | null
          theme: string[] | null
          theme_flattened: string | null
          total_comments: number | null
          video: string | null
        }
        Relationships: []
      }
      signs_themes: {
        Row: {
          count: number | null
          theme: string | null
        }
        Relationships: []
      }
      signs_view: {
        Row: {
          annotated_by_user_id: string | null
          annotation: Json | null
          annotation_array: number[] | null
          comment: string | null
          context_video: string | null
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          district: string | null
          frequency: number | null
          game_video: string | null
          id: number | null
          image: string | null
          is_anotated: number | null
          last_changed: string | null
          main_sign_id: number | null
          name: string | null
          sentence: string | null
          status: Database["public"]["Enums"]["moderation_status"] | null
          theme: string[] | null
          theme_flattened: string | null
          video: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signs_main_sign_id_fkey"
            columns: ["main_sign_id"]
            isOneToOne: false
            referencedRelation: "signs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_main_sign_id_fkey"
            columns: ["main_sign_id"]
            isOneToOne: false
            referencedRelation: "signs_statistics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_main_sign_id_fkey"
            columns: ["main_sign_id"]
            isOneToOne: false
            referencedRelation: "signs_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signs_main_sign_id_fkey"
            columns: ["main_sign_id"]
            isOneToOne: false
            referencedRelation: "signs_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["user_permission"]
        }
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: { event: Json }
        Returns: Json
      }
      get_closest_signs: {
        Args: {
          query_array: number[]
          limit_count: number
          offset_count: number
        }
        Returns: {
          id: number
          created_at: string
          name: string
          video: string
          annotation: Json
          theme: string[]
          is_anotated: number
          last_changed: string
          description: string
          annotation_array: number[]
          context_video: string
          sentence: string
          frequency: number
          theme_flattened: string
          district: string
        }[]
      }
      get_closest_signs_fc: {
        Args: {
          query_array: number[]
          limit_count: number
          offset_count: number
        }
        Returns: {
          id: number
          created_at: string
          name: string
          video: string
          annotation: Json
          theme: string[]
          is_anotated: number
          last_changed: string
          description: string
          annotation_array: number[]
          context_video: string
          sentence: string
          frequency: number
          theme_flattened: string
          district: string
        }[]
      }
      get_event_interest_count: {
        Args: { event_id: number; user_id?: string }
        Returns: {
          count: number
          has_interest: boolean
        }[]
      }
      get_guide_useful_count: {
        Args: { guide_id: number; user_id?: string }
        Returns: {
          count: number
          has_useful: boolean
        }[]
      }
      hamming_distance: {
        Args: { array1: number[]; array2: number[] }
        Returns: number
      }
      search_name: {
        Args: { term: string }
        Returns: {
          annotated_by_user_id: string | null
          annotation: Json | null
          annotation_array: number[] | null
          context_video: string | null
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          district: string | null
          frequency: number | null
          game_video: string | null
          id: number
          image: string | null
          is_anotated: number | null
          last_changed: string | null
          main_sign_id: number | null
          name: string | null
          sentence: string | null
          theme: string[] | null
          theme_flattened: string | null
          video: string | null
        }[]
      }
      search_unaccent_name: {
        Args: { search_term: string }
        Returns: {
          annotated_by_user_id: string | null
          annotation: Json | null
          annotation_array: number[] | null
          context_video: string | null
          created_at: string | null
          created_by_user_id: string | null
          description: string | null
          district: string | null
          frequency: number | null
          game_video: string | null
          id: number
          image: string | null
          is_anotated: number | null
          last_changed: string | null
          main_sign_id: number | null
          name: string | null
          sentence: string | null
          theme: string[] | null
          theme_flattened: string | null
          video: string | null
        }[]
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
      update_user_types: {
        Args: { types: Database["public"]["CompositeTypes"]["user_type"][] }
        Returns: undefined
      }
      verify_user_password: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
      feature:
        | "annotate"
        | "dictionary"
        | "fcdictionary"
        | "guides"
        | "events"
        | "map"
        | "docs"
        | "lgp4fun"
        | "crowdsource"
      guide_difficulty: "easy" | "medium" | "hard"
      guide_duration: "short" | "medium" | "long"
      moderation_status:
        | "pending"
        | "changes_requested"
        | "approved"
        | "rejected"
      notification_type:
        | "guide_pending"
        | "guide_changes_requested"
        | "guide_approved"
        | "guide_rejected"
        | "event_pending"
        | "event_changes_requested"
        | "event_approved"
        | "event_rejected"
        | "map_pin_pending"
        | "map_pin_changes_requested"
        | "map_pin_approved"
        | "map_pin_rejected"
        | "sign_pending"
        | "sign_changes_requested"
        | "sign_approved"
        | "sign_rejected"
      user_permission:
        | "user_roles.update"
        | "user_types.update"
        | "features.update"
        | "branding.update"
        | "guides.create"
        | "guides.update"
        | "guides.delete"
        | "guides.moderate"
        | "events.create"
        | "events.update"
        | "events.delete"
        | "events.moderate"
        | "map.create"
        | "map.update"
        | "map.delete"
        | "map.moderate"
        | "signs.create"
        | "signs.update"
        | "signs.delete"
        | "signs.moderate"
      user_role: "user" | "moderator" | "admin" | "developer"
    }
    CompositeTypes: {
      user_type: {
        slug: string | null
        label: string | null
        is_default: boolean | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      feature: [
        "annotate",
        "dictionary",
        "fcdictionary",
        "guides",
        "events",
        "map",
        "docs",
        "lgp4fun",
        "crowdsource",
      ],
      guide_difficulty: ["easy", "medium", "hard"],
      guide_duration: ["short", "medium", "long"],
      moderation_status: [
        "pending",
        "changes_requested",
        "approved",
        "rejected",
      ],
      notification_type: [
        "guide_pending",
        "guide_changes_requested",
        "guide_approved",
        "guide_rejected",
        "event_pending",
        "event_changes_requested",
        "event_approved",
        "event_rejected",
        "map_pin_pending",
        "map_pin_changes_requested",
        "map_pin_approved",
        "map_pin_rejected",
        "sign_pending",
        "sign_changes_requested",
        "sign_approved",
        "sign_rejected",
      ],
      user_permission: [
        "user_roles.update",
        "user_types.update",
        "features.update",
        "branding.update",
        "guides.create",
        "guides.update",
        "guides.delete",
        "guides.moderate",
        "events.create",
        "events.update",
        "events.delete",
        "events.moderate",
        "map.create",
        "map.update",
        "map.delete",
        "map.moderate",
        "signs.create",
        "signs.update",
        "signs.delete",
        "signs.moderate",
      ],
      user_role: ["user", "moderator", "admin", "developer"],
    },
  },
} as const
