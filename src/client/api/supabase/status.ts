// src/client/api/supabase/status.ts
import {
    getSupabaseEnvStatus,
    isSupabaseConfigured,
  } from "@/client/api/supabase/env";
  
  export type SupabaseArchitectureStatus = {
    envNames: string[];
    hasPublishableKey: boolean;
    hasUrl: boolean;
    isConfigured: boolean;
  };
  
  export function getSupabaseArchitectureStatus(): SupabaseArchitectureStatus {
    const env = getSupabaseEnvStatus();
  
    return {
      envNames: env.names,
      hasPublishableKey: env.hasPublishableKey,
      hasUrl: env.hasUrl,
      isConfigured: isSupabaseConfigured(),
    };
  }
  