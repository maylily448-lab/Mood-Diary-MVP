export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            daily_quotes: {
                Row: {
                    id: string
                    quote: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    quote: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    quote?: string
                    created_at?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    nickname: string
                    age: number | null
                    gender: string | null
                    mood_level: number | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    nickname: string
                    age?: number | null
                    gender?: string | null
                    mood_level?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    nickname?: string
                    age?: number | null
                    gender?: string | null
                    mood_level?: number | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            mood_entries: {
                Row: {
                    id: string
                    user_id: string | null
                    emoji_type: string
                    memo: string | null
                    created_at: string
                    energy_level: number | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    emoji_type: string
                    memo?: string | null
                    created_at?: string
                    energy_level?: number | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    emoji_type?: string
                    memo?: string | null
                    created_at?: string
                    energy_level?: number | null
                }
                Relationships: []
            }
            cheer_messages: {
                Row: {
                    id: string
                    mood_type: string
                    energy_range_start: number
                    energy_range_end: number
                    message: string
                }
                Insert: {
                    id?: string
                    mood_type: string
                    energy_range_start: number
                    energy_range_end: number
                    message: string
                }
                Update: {
                    id?: string
                    mood_type?: string
                    energy_range_start?: number
                    energy_range_end?: number
                    message?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
