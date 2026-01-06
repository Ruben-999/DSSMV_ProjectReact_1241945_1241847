import { supabase } from './supabaseClient';
import { ILembreteService, ServiceResponse } from '../interfaces';
import { Lembrete, LembreteInput } from '../../redux/types';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

const uploadImage = async (localUri: string, userId: string): Promise<string | null> => {
  try {
    // Ler o ficheiro como String Base64
    const base64 = await FileSystem.readAsStringAsync(localUri, { // transforma imagem em string  
      encoding: 'base64',                                         // para facilitar transporte 
    });

    // Gerar nome único
    const fileExt = localUri.split('.').pop() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload usando ArrayBuffer
    const { data, error } = await supabase.storage
      .from('lembretes-fotos')
      .upload(fileName, decode(base64), { //decode para reconverter a strig em imagem antes de dar upload
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    // Retorna o caminho (path) para guardar na BD (Supabase)
    return data.path; 
  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    return null;
  }
};

export const LembreteServiceSupabase: ILembreteService = {

  async getLembretes(userId: string): Promise<ServiceResponse<Lembrete[]>> {
    const { data, error } = await supabase
      .from('lembretes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data as Lembrete[], error: null };
  },

  // --- CREATE ---
  async createLembrete(lembreteData: LembreteInput ): Promise<ServiceResponse<Lembrete>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "Usuário não autenticado" };

      let finalImagePath = null;

      // 1. Upload da Imagem
      // Nota: O ecrã enviou 'foto_url' com o caminho local (file://...)
      if (lembreteData.foto_url && lembreteData.foto_url.startsWith('file://')) {
        finalImagePath = await uploadImage(lembreteData.foto_url, user.id);
      }

      // 2. Preparar objeto final
      const objectToSave = {
        ...lembreteData,
        user_id: user.id,
        // Substituir o file:// pelo path do Supabase
        foto_url: finalImagePath, 
        created_at: new Date().toISOString(), // Opcional, o Supabase gera isto, mas o TS pode pedir
      };

      // 3. Insert
      const { data, error } = await supabase
        .from('lembretes')
        .insert(objectToSave)
        .select()
        .single();

      if (error) throw error;

      return { data: data as Lembrete, error: null };

    } catch (error: any) {
      console.error("Erro ao criar:", error);
      return { data: null, error: error.message };
    }
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
    const { error } = await supabase.from('lembretes').delete().eq('id', id);
    if (error) return { data: false, error: error.message };
    return { data: true, error: null };
  }
};