export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          event_date_at: string;
          event_date_end: string;
          author_id: number | null;
          event_place: string;
          category: string;
          type: string;
          group_id: number | null;
          description: string;
          images: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          event_date_at: string;
          event_date_end: string;
          author_id?: number | null;
          event_place: string;
          category: string;
          type: string;
          group_id?: number | null;
          description: string;
          images?: string;
        };
        Update: {
          id?: number;
          created_at?: string;
          name: string;
          event_date_at: string;
          event_date_end: string;
          author_id?: number | null;
          event_place: string;
          category: string;
          type: string;
          group_id?: number | null;
          description: string;
          images?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
