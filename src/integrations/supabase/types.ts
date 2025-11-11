export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alertas: {
        Row: {
          camion_id: string
          descripcion: string | null
          estado: string | null
          id: string
          minutos_sin_cruce: number | null
          prioridad: string | null
          resuelto_en: string | null
          resuelto_por: string | null
          saldo_alerta: number | null
          tag_relacionado: string | null
          timestamp: string
          tipo: string
          titulo: string
        }
        Insert: {
          camion_id: string
          descripcion?: string | null
          estado?: string | null
          id?: string
          minutos_sin_cruce?: number | null
          prioridad?: string | null
          resuelto_en?: string | null
          resuelto_por?: string | null
          saldo_alerta?: number | null
          tag_relacionado?: string | null
          timestamp?: string
          tipo: string
          titulo: string
        }
        Update: {
          camion_id?: string
          descripcion?: string | null
          estado?: string | null
          id?: string
          minutos_sin_cruce?: number | null
          prioridad?: string | null
          resuelto_en?: string | null
          resuelto_por?: string | null
          saldo_alerta?: number | null
          tag_relacionado?: string | null
          timestamp?: string
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_camion_id_fkey"
            columns: ["camion_id"]
            isOneToOne: false
            referencedRelation: "camiones"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_config: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          interval_minutes: number
          last_execution: string | null
          next_execution: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          interval_minutes?: number
          last_execution?: string | null
          next_execution?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          interval_minutes?: number
          last_execution?: string | null
          next_execution?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      bot_execution_logs: {
        Row: {
          created_at: string
          end_time: string | null
          error_message: string | null
          execution_details: Json | null
          execution_id: string
          id: string
          records_processed: number | null
          start_time: string
          status: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          error_message?: string | null
          execution_details?: Json | null
          execution_id: string
          id?: string
          records_processed?: number | null
          start_time?: string
          status: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          error_message?: string | null
          execution_details?: Json | null
          execution_id?: string
          id?: string
          records_processed?: number | null
          start_time?: string
          status?: string
        }
        Relationships: []
      }
      camiones: {
        Row: {
          año: number | null
          combustible_porcentaje: number | null
          conductor_id: string | null
          created_at: string
          estado: string | null
          gasto_dia_actual: number | null
          id: string
          kilometraje_total: number | null
          modelo: string | null
          placas: string
          ruta_asignada_id: string | null
          saldo_actual: number | null
          spot_unit_id: string | null
          tag_id: string | null
          ubicacion_actual_lat: number | null
          ubicacion_actual_lng: number | null
          ultimo_cruce_id: string | null
          ultimo_cruce_timestamp: string | null
          ultimo_mantenimiento: string | null
          updated_at: string
          user_id: string | null
          velocidad_actual: number | null
        }
        Insert: {
          año?: number | null
          combustible_porcentaje?: number | null
          conductor_id?: string | null
          created_at?: string
          estado?: string | null
          gasto_dia_actual?: number | null
          id?: string
          kilometraje_total?: number | null
          modelo?: string | null
          placas: string
          ruta_asignada_id?: string | null
          saldo_actual?: number | null
          spot_unit_id?: string | null
          tag_id?: string | null
          ubicacion_actual_lat?: number | null
          ubicacion_actual_lng?: number | null
          ultimo_cruce_id?: string | null
          ultimo_cruce_timestamp?: string | null
          ultimo_mantenimiento?: string | null
          updated_at?: string
          user_id?: string | null
          velocidad_actual?: number | null
        }
        Update: {
          año?: number | null
          combustible_porcentaje?: number | null
          conductor_id?: string | null
          created_at?: string
          estado?: string | null
          gasto_dia_actual?: number | null
          id?: string
          kilometraje_total?: number | null
          modelo?: string | null
          placas?: string
          ruta_asignada_id?: string | null
          saldo_actual?: number | null
          spot_unit_id?: string | null
          tag_id?: string | null
          ubicacion_actual_lat?: number | null
          ubicacion_actual_lng?: number | null
          ultimo_cruce_id?: string | null
          ultimo_cruce_timestamp?: string | null
          ultimo_mantenimiento?: string | null
          updated_at?: string
          user_id?: string | null
          velocidad_actual?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "camiones_conductor_id_fkey"
            columns: ["conductor_id"]
            isOneToOne: false
            referencedRelation: "conductores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "camiones_ruta_asignada_id_fkey"
            columns: ["ruta_asignada_id"]
            isOneToOne: false
            referencedRelation: "rutas"
            referencedColumns: ["id"]
          },
        ]
      }
      casetas_autopista: {
        Row: {
          activa: boolean | null
          autopista: string
          created_at: string
          direccion_valida: string[] | null
          id: string
          km: number | null
          lat: number
          lng: number
          nombre: string
          plaza_nombre: string | null
          sentido: string | null
          tipo_caseta: string | null
        }
        Insert: {
          activa?: boolean | null
          autopista: string
          created_at?: string
          direccion_valida?: string[] | null
          id?: string
          km?: number | null
          lat: number
          lng: number
          nombre: string
          plaza_nombre?: string | null
          sentido?: string | null
          tipo_caseta?: string | null
        }
        Update: {
          activa?: boolean | null
          autopista?: string
          created_at?: string
          direccion_valida?: string[] | null
          id?: string
          km?: number | null
          lat?: number
          lng?: number
          nombre?: string
          plaza_nombre?: string | null
          sentido?: string | null
          tipo_caseta?: string | null
        }
        Relationships: []
      }
      checkpoints: {
        Row: {
          created_at: string
          created_by: string | null
          enabled: boolean
          geometry_type: string
          id: number
          lat: number | null
          lng: number | null
          name: string
          polygon: Json | null
          radius_m: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          geometry_type?: string
          id?: number
          lat?: number | null
          lng?: number | null
          name: string
          polygon?: Json | null
          radius_m?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          geometry_type?: string
          id?: number
          lat?: number | null
          lng?: number | null
          name?: string
          polygon?: Json | null
          radius_m?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      conductores: {
        Row: {
          created_at: string
          email: string | null
          estado: string | null
          id: string
          licencia: string
          nombre: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          estado?: string | null
          id?: string
          licencia: string
          nombre: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          estado?: string | null
          id?: string
          licencia?: string
          nombre?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contactos: {
        Row: {
          celular: string
          correo: string
          created_at: string
          empresa: string
          id: string
          leido: boolean | null
          necesidad: string
          nombre: string
        }
        Insert: {
          celular: string
          correo: string
          created_at?: string
          empresa: string
          id?: string
          leido?: boolean | null
          necesidad: string
          nombre: string
        }
        Update: {
          celular?: string
          correo?: string
          created_at?: string
          empresa?: string
          id?: string
          leido?: boolean | null
          necesidad?: string
          nombre?: string
        }
        Relationships: []
      }
      cruces_registrados: {
        Row: {
          camion_id: string
          caseta_id: string
          id: string
          ruta_id: string | null
          timestamp: string
          tipo_cruce: string
        }
        Insert: {
          camion_id: string
          caseta_id: string
          id?: string
          ruta_id?: string | null
          timestamp?: string
          tipo_cruce: string
        }
        Update: {
          camion_id?: string
          caseta_id?: string
          id?: string
          ruta_id?: string | null
          timestamp?: string
          tipo_cruce?: string
        }
        Relationships: [
          {
            foreignKeyName: "cruces_registrados_camion_id_fkey"
            columns: ["camion_id"]
            isOneToOne: false
            referencedRelation: "camiones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cruces_registrados_caseta_id_fkey"
            columns: ["caseta_id"]
            isOneToOne: false
            referencedRelation: "casetas_autopista"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cruces_registrados_ruta_id_fkey"
            columns: ["ruta_id"]
            isOneToOne: false
            referencedRelation: "rutas"
            referencedColumns: ["id"]
          },
        ]
      }
      duplicate_charge_alerts: {
        Row: {
          created_at: string
          first_event: Json
          id: string
          resolved_at: string | null
          resolved_by: string | null
          second_event: Json
          status: string
          tag_id: string
          time_difference_minutes: number
        }
        Insert: {
          created_at?: string
          first_event: Json
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          second_event: Json
          status?: string
          tag_id: string
          time_difference_minutes: number
        }
        Update: {
          created_at?: string
          first_event?: Json
          id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          second_event?: Json
          status?: string
          tag_id?: string
          time_difference_minutes?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          id: number
          lat: number
          lng: number
          meta: Json | null
          ref_id: number | null
          ref_type: string | null
          ts: string
          type: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          lat: number
          lng: number
          meta?: Json | null
          ref_id?: number | null
          ref_type?: string | null
          ts: string
          type: string
          unit_id: string
        }
        Update: {
          created_at?: string
          id?: number
          lat?: number
          lng?: number
          meta?: Json | null
          ref_id?: number | null
          ref_type?: string | null
          ts?: string
          type?: string
          unit_id?: string
        }
        Relationships: []
      }
      movimiento_rastros: {
        Row: {
          camion_id: string
          caseta_id: string
          created_at: string
          direccion_inferida: string | null
          id: string
          orden_secuencia: number | null
          timestamp: string
          toll_event_id: string | null
        }
        Insert: {
          camion_id: string
          caseta_id: string
          created_at?: string
          direccion_inferida?: string | null
          id?: string
          orden_secuencia?: number | null
          timestamp: string
          toll_event_id?: string | null
        }
        Update: {
          camion_id?: string
          caseta_id?: string
          created_at?: string
          direccion_inferida?: string | null
          id?: string
          orden_secuencia?: number | null
          timestamp?: string
          toll_event_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "movimiento_rastros_camion_id_fkey"
            columns: ["camion_id"]
            isOneToOne: false
            referencedRelation: "camiones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimiento_rastros_caseta_id_fkey"
            columns: ["caseta_id"]
            isOneToOne: false
            referencedRelation: "casetas_autopista"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimiento_rastros_toll_event_id_fkey"
            columns: ["toll_event_id"]
            isOneToOne: false
            referencedRelation: "toll_events"
            referencedColumns: ["id"]
          },
        ]
      }
      notify_rules: {
        Row: {
          channel: Json
          conditions: Json | null
          created_at: string
          enabled: boolean
          id: number
          name: string
          target_id: number
          target_type: string
          updated_at: string
        }
        Insert: {
          channel: Json
          conditions?: Json | null
          created_at?: string
          enabled?: boolean
          id?: number
          name: string
          target_id: number
          target_type: string
          updated_at?: string
        }
        Update: {
          channel?: Json
          conditions?: Json | null
          created_at?: string
          enabled?: boolean
          id?: number
          name?: string
          target_id?: number
          target_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          altitude: number | null
          created_at: string
          id: number
          lat: number
          lng: number
          processed: boolean
          raw: Json
          ts: string
          unit_id: string
        }
        Insert: {
          altitude?: number | null
          created_at?: string
          id?: number
          lat: number
          lng: number
          processed?: boolean
          raw: Json
          ts: string
          unit_id: string
        }
        Update: {
          altitude?: number | null
          created_at?: string
          id?: number
          lat?: number
          lng?: number
          processed?: boolean
          raw?: Json
          ts?: string
          unit_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          user_type?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: []
      }
      routes: {
        Row: {
          created_at: string
          id: number
          line_geometry: Json
          name: string
          sector_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          line_geometry: Json
          name: string
          sector_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          line_geometry?: Json
          name?: string
          sector_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      rutas: {
        Row: {
          activa: boolean | null
          created_at: string
          descripcion: string | null
          destino: string
          distancia_km: number | null
          id: string
          nombre: string
          origen: string
          tiempo_estimado_hrs: number | null
          updated_at: string
        }
        Insert: {
          activa?: boolean | null
          created_at?: string
          descripcion?: string | null
          destino: string
          distancia_km?: number | null
          id?: string
          nombre: string
          origen: string
          tiempo_estimado_hrs?: number | null
          updated_at?: string
        }
        Update: {
          activa?: boolean | null
          created_at?: string
          descripcion?: string | null
          destino?: string
          distancia_km?: number | null
          id?: string
          nombre?: string
          origen?: string
          tiempo_estimado_hrs?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      sector_history: {
        Row: {
          action: string
          changed_by: string | null
          created_at: string
          id: number
          new_geometry: Json | null
          old_geometry: Json | null
          parameters: Json | null
          sector_id: number
        }
        Insert: {
          action: string
          changed_by?: string | null
          created_at?: string
          id?: number
          new_geometry?: Json | null
          old_geometry?: Json | null
          parameters?: Json | null
          sector_id: number
        }
        Update: {
          action?: string
          changed_by?: string | null
          created_at?: string
          id?: number
          new_geometry?: Json | null
          old_geometry?: Json | null
          parameters?: Json | null
          sector_id?: number
        }
        Relationships: []
      }
      sectors: {
        Row: {
          buffer_m: number | null
          color: string | null
          created_at: string
          created_by: string | null
          enabled: boolean
          id: number
          is_proposed: boolean | null
          name: string
          polygon: Json
          source: string | null
          updated_at: string
        }
        Insert: {
          buffer_m?: number | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: number
          is_proposed?: boolean | null
          name: string
          polygon: Json
          source?: string | null
          updated_at?: string
        }
        Update: {
          buffer_m?: number | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          enabled?: boolean
          id?: number
          is_proposed?: boolean | null
          name?: string
          polygon?: Json
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      supervisores: {
        Row: {
          created_at: string
          email: string
          empresa: string | null
          id: string
          nombre: string
          rol: string | null
          telefono: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          empresa?: string | null
          id?: string
          nombre: string
          rol?: string | null
          telefono?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          empresa?: string | null
          id?: string
          nombre?: string
          rol?: string | null
          telefono?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      toll_events: {
        Row: {
          carril_id: number | null
          caseta_id: string | null
          caseta_nombre: string | null
          clase: string | null
          concepto: string | null
          created_at: string
          fecha_hora: string
          folio: string | null
          id: string
          importe: number | null
          reconciled: boolean | null
          saldo: number | null
          source_type: string | null
          tag_id: string
          updated_at: string
        }
        Insert: {
          carril_id?: number | null
          caseta_id?: string | null
          caseta_nombre?: string | null
          clase?: string | null
          concepto?: string | null
          created_at?: string
          fecha_hora: string
          folio?: string | null
          id?: string
          importe?: number | null
          reconciled?: boolean | null
          saldo?: number | null
          source_type?: string | null
          tag_id: string
          updated_at?: string
        }
        Update: {
          carril_id?: number | null
          caseta_id?: string | null
          caseta_nombre?: string | null
          clase?: string | null
          concepto?: string | null
          created_at?: string
          fecha_hora?: string
          folio?: string | null
          id?: string
          importe?: number | null
          reconciled?: boolean | null
          saldo?: number | null
          source_type?: string | null
          tag_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "toll_events_caseta_id_fkey"
            columns: ["caseta_id"]
            isOneToOne: false
            referencedRelation: "casetas_autopista"
            referencedColumns: ["id"]
          },
        ]
      }
      ubicaciones_tiempo_real: {
        Row: {
          camion_id: string
          direccion: string | null
          id: string
          lat: number
          lng: number
          timestamp: string
          velocidad: number | null
        }
        Insert: {
          camion_id: string
          direccion?: string | null
          id?: string
          lat: number
          lng: number
          timestamp?: string
          velocidad?: number | null
        }
        Update: {
          camion_id?: string
          direccion?: string | null
          id?: string
          lat?: number
          lng?: number
          timestamp?: string
          velocidad?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ubicaciones_tiempo_real_camion_id_fkey"
            columns: ["camion_id"]
            isOneToOne: false
            referencedRelation: "camiones"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_states: {
        Row: {
          entered_at: string | null
          id: number
          is_inside: boolean
          last_seen: string | null
          ref_id: number
          ref_type: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          entered_at?: string | null
          id?: number
          is_inside?: boolean
          last_seen?: string | null
          ref_id: number
          ref_type: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          entered_at?: string | null
          id?: number
          is_inside?: boolean
          last_seen?: string | null
          ref_id?: number
          ref_type?: string
          unit_id?: string
          updated_at?: string
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
    Enums: {},
  },
} as const
