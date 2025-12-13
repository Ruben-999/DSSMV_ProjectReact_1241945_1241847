import { supabase } from './supabaseClient';
import { ILembreteService, ServiceResponse } from '../interfaces';
import { Lembrete } from '../../redux/types';

export const LembreteServiceSupabase: ILembreteService = {

  async getLembretes(userId: string): Promise<ServiceResponse<Lembrete[]>> {
    const { data, error } = await supabase
      .from('lembretes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // Ordenar por mais recente

    if (error) return { data: null, error: error.message };
    return { data: data as Lembrete[], error: null };
  },

  async createLembrete(lembrete): Promise<ServiceResponse<Lembrete>> {
    const { data, error } = await supabase
      .from('lembretes')
      .insert(lembrete)
      .select()
      .single(); // Retorna o objeto criado

    if (error) return { data: null, error: error.message };
    return { data: data as Lembrete, error: null };
  },

  async updateLembrete(id, updates): Promise<ServiceResponse<Lembrete>> {
    const { data, error } = await supabase
      .from('lembretes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Lembrete, error: null };
  },

  async deleteLembrete(id): Promise<ServiceResponse<boolean>> {
    const { error } = await supabase
      .from('lembretes')
      .delete()
      .eq('id', id);

    if (error) return { data: false, error: error.message };
    return { data: true, error: null };
  }
};