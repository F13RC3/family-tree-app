import { createClient } from '@supabase/supabase-js';
import { FamilyMember, Relationship } from '../types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase env vars. Create .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const AuthAPI = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};

export const MemberAPI = {
  getAll: async (userId: string): Promise<FamilyMember[]> => {
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data as FamilyMember[];
  },
  create: async (member: Omit<FamilyMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('family_members')
      .insert(member)
      .select()
      .single();
    if (error) throw error;
    return data as FamilyMember;
  },
  update: async (id: string, updates: Partial<FamilyMember>) => {
    const { data, error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as FamilyMember;
  },
  delete: async (id: string) => {
    const { error } = await supabase.from('family_members').delete().eq('id', id);
    if (error) throw error;
  },
};

export const RelationshipAPI = {
  create: async (rel: Omit<Relationship, 'id'>) => {
    const { data, error } = await supabase
      .from('relationships')
      .insert(rel)
      .select()
      .single();
    if (error) throw error;
    return data as Relationship;
  },
  getByUser: async (userId: string): Promise<Relationship[]> => {
    const { data, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data as Relationship[];
  },
};
