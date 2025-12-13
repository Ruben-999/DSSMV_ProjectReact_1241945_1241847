import { IAuthService, ICategoriaService, ILembreteService, IListaService } from './interfaces';
import { AuthServiceSupabase } from './supabase/AuthServiceSupabase';
import { LembreteServiceSupabase } from './supabase/LembreteServiceSupabase';
import {ListaServiceSupabase} from './supabase/ListaServiceSupabase'
import {CategoriaServiceSupabase} from './supabase/CategoriaServiceSupabase'

// Aqui definesse qual a implementação que a app vai usar.
// Se por exemplo mudarmos de supabase para firebase, apenas alteramos a implenentação da interface (parte direita)
export const apiAuth: IAuthService = AuthServiceSupabase;

export const apiLembretes: ILembreteService = LembreteServiceSupabase;

export const apiListas: IListaService = ListaServiceSupabase;

export const apiCategorias: ICategoriaService = CategoriaServiceSupabase;