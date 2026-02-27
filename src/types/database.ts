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
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    emoji_type: string
                    memo?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    emoji_type?: string
                    memo?: string | null
                    created_at?: string
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
