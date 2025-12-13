import { supabase } from './supabaseClient';
import { ICategoriaService, ServiceResponse } from '../interfaces';
import { Categoria } from '../../redux/types';

export const CategoriaServiceSupabase: ICategoriaService = {

  async getCategorias(userId: string): Promise<ServiceResponse<Categoria[]>> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('user_id', userId)
      .order('nome', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data as Categoria[], error: null };
  },

  async createCategoria(categoria): Promise<ServiceResponse<Categoria>> {
    const { data, error } = await supabase
      .from('categorias')
      .insert(categoria) // O objeto traz { nome, cor_hex, user_id }
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Categoria, error: null };
  },

  async updateCategoria(id: string, updates: Partial<Categoria>): Promise<ServiceResponse<Categoria>> {
    const { data, error } = await supabase
      .from('categorias')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Categoria, error: null };
  },

  async deleteCategoria(id: string): Promise<ServiceResponse<boolean>> {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) return { data: false, error: error.message };
    return { data: true, error: null };
  }
};