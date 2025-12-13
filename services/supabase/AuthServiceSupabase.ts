import { supabase } from './supabaseClient';
import { IAuthService, ServiceResponse } from '../interfaces';
import { User } from '../../redux/types';

export const AuthServiceSupabase: IAuthService = {

  //Login
  async signIn(email: string, pass: string): Promise<ServiceResponse<User>> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    // Mapear o user do Supabase para o nosso tipo User da App
    const user: User = {
      id: data.user.id,
      email: data.user.email || '',
      nome: data.user.user_metadata.name || '', // O nome vem dos metadados
      created_at: data.user.created_at,
    };

    return { data: user, error: null };
  },

  //Registo
async signUp(email: string, pass: string, name: string): Promise<ServiceResponse<User>> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name: name, // Metadados para o trigger
        },
      },
    });

    if (error) {
      return { data: null, error: error.message };
    }

    // Como a confirmação de email está DESLIGADA, se 'data.user' existir,
    // o registo foi um sucesso total e o user já está autenticado.
    if (data.user) {
        const user: User = {
            id: data.user.id,
            email: data.user.email || '',
            nome: name, // Usamos o nome passado argumento pois é garantido
            created_at: data.user.created_at, // 
        };
        return { data: user, error: null };
    }
    
    // Caso de fallback raro (se algo falhar mas não der erro explícito)
    return { data: null, error: 'Erro no registo.' };
  },

  //Logout
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  //Verificar sessão atual (útil para auto-login ao abrir a app)
  async getCurrentUser(): Promise<User | null> {
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        nome: data.session.user.user_metadata.name || '',
        created_at: data.session.user.created_at,
      };
    }
    return null;
  }
};