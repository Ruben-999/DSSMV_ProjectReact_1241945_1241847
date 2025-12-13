import { supabase } from './supabaseClient';
import { IListaService, ServiceResponse } from '../interfaces';
import { Lista } from '../../redux/types';

export const ListaServiceSupabase: IListaService = {

  async getListas(userId: string): Promise<ServiceResponse<Lista[]>> {
    const { data, error } = await supabase
      .from('listas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }); // Geralmente listas ordenam-se por criação ou alfabeticamente

    if (error) return { data: null, error: error.message };
    return { data: data as Lista[], error: null };
  },

  async createLista(lista): Promise<ServiceResponse<Lista>> {
    const { data, error } = await supabase
      .from('listas')
      .insert(lista) // O objeto já traz { nome, descricao, cor_hex, user_id }
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Lista, error: null };
  },

  async updateLista(id, updates ): Promise<ServiceResponse<Lista>> {
    const{data,error} = await supabase
        .from('listas')
        .update(updates)
        .eq('id',id)
        .select()
        .single()
    
    if (error) return { data: null, error: error.message };
       return { data: data as Lista, error: null };
  },

  async deleteLista(id: string): Promise<ServiceResponse<boolean>> {
    const { error } = await supabase
      .from('listas')
      .delete()
      .eq('id', id);

    if (error) return { data: false, error: error.message };
    return { data: true, error: null };
  }
};