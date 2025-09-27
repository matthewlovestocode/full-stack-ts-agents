import { createClient, SupabaseClient } from '@supabase/supabase-js';

type SupabaseClientOptions = {
  serviceRoleKey?: string;
  anonKey?: string;
};

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const createServiceRoleClient = (options: SupabaseClientOptions = {}): SupabaseClient => {
  const url = getEnv('SUPABASE_URL');
  const serviceRoleKey = options.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Supabase service role key is required to instantiate the service client.');
  }

  return createClient(url, serviceRoleKey);
};

export const createAnonClient = (options: SupabaseClientOptions = {}): SupabaseClient => {
  const url = getEnv('SUPABASE_URL');
  const anonKey = options.anonKey ?? process.env.SUPABASE_ANON_KEY;

  if (!anonKey) {
    throw new Error('Supabase anon key is required to instantiate the anon client.');
  }

  return createClient(url, anonKey);
};
