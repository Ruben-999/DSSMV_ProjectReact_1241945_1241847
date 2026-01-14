import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { RootState } from '../../redux/reducers';

type RouteParams = {
  listaId: string;
};

const ID_TODOS = 'todos';
const ID_SEM_LISTA = 'sem_lista';

// Dados do SupaBase Storage
const SUPABASE_PROJECT_ID = 'qrcsmtgswmlpcyivsquu';
const BUCKET_NAME = 'lembretes-fotos';

const ListDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { listaId } = route.params as RouteParams;
  const isSemLista = String(listaId) === ID_SEM_LISTA;

  const lista = useSelector((s: RootState) =>
    s.listas.items.find(l => String(l.id) === String(listaId))
  );

  const lembretes = useSelector((s: RootState) => s.lembretes.items);

  const categoriaAtivaId = useSelector(
    (s: RootState) => (s.categorias as any).categoriaAtivaId
  );

  const getPrioridadeColor = (prioridade: number) => {
    if (prioridade === 3) return '#ff6b6b';
    if (prioridade === 2) return '#fde047';
    return '#22c55e';
  };

  const getPrioridadeLabel = (prioridade: number) => {
    if (prioridade === 3) return 'Alta';
    if (prioridade === 2) return 'MÈdia';
    return 'Baixa';
  };

  const getImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  const lembretesFiltrados = useMemo(() => {
    const filtrados = lembretes.filter(l => {
      if (isSemLista) {
        if (l.lista_id) return false;
      } else if (String(l.lista_id) !== String(listaId)) {
        return false;
      }
      if (categoriaAtivaId === ID_TODOS) return true;
      return String(l.categoria_id) === String(categoriaAtivaId);
    });
    return filtrados.sort((a, b) => {
      if (b.prioridade !== a.prioridade) return b.prioridade - a.prioridade;
      if (a.data_hora && b.data_hora) {
        return b.data_hora.localeCompare(a.data_hora);
      }
      if (a.created_at && b.created_at) {
        return b.created_at.localeCompare(a.created_at);
      }
      return 0;
    });
  }, [lembretes, listaId, categoriaAtivaId, isSemLista]);

  const listaAtual = isSemLista
    ? {
        id: ID_SEM_LISTA,
        nome: 'Sem Lista',
        descricao: 'Lembretes sem lista',
        cor_hex: '#121212',
        is_default: true,
      }
    : lista;

  if (!listaAtual) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#121212' }]}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Lista n√£o encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  const backgroundColor = listaAtual.cor_hex ?? '#121212';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Voltar</Text>
        </TouchableOpacity>

        {!isSemLista && (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditList', { listaId })}
          >
            <Ionicons name="pencil" size={20} color="#facc15" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{listaAtual.nome}</Text>
      {listaAtual.descricao ? (
        <Text style={styles.subtitle}>{listaAtual.descricao}</Text>
      ) : null}

      {lembretesFiltrados.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Sem lembretes nesta lista</Text>
        </View>
      ) : (
        <FlatList
          data={lembretesFiltrados}
          keyExtractor={i => String(i.id)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const imageUrl = getImageUrl(item.foto_url);
            return (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('LembreteDetails', {
                  lembreteId: item.id,
                })
              }
            >
              <Text
                style={[
                  styles.rowTitle,
                  item.prioridade > 0 && {
                    color: getPrioridadeColor(item.prioridade),
                  },
                ]}
              >
                {item.titulo}
              </Text>
              {item.descricao ? (
                <Text style={styles.rowDesc}>{item.descricao}</Text>
              ) : null}
              {imageUrl ? (
                <View style={styles.rowImageWrapper}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.rowImage}
                  />
                </View>
              ) : null}
              <View style={styles.rowMeta}>
                {item.data_hora ? (
                  <Text style={styles.rowMetaText}>
                    Data: {new Date(item.data_hora).toLocaleDateString()}
                  </Text>
                ) : null}
                {item.prioridade > 0 ? (
                  <Text
                    style={[
                      styles.rowMetaText,
                      { color: getPrioridadeColor(item.prioridade) },
                    ]}
                  >
                    Prioridade: {getPrioridadeLabel(item.prioridade)}
                  </Text>
                ) : null}
              
                {item.local_latitude != null && item.local_longitude != null ? (
                  <Text style={styles.rowMetaText}>
                    Local: {item.local_latitude.toFixed(4)}, {item.local_longitude.toFixed(4)}
                  </Text>
                ) : null}
</View>
            </TouchableOpacity>
          )}}
        />
      )}

      {!isSemLista && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: '#00000055' }]}
          onPress={() =>
            navigation.navigate('AddLembreteToLista', { listaId })
          }
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ListDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  back: {
    color: '#fff',
    fontWeight: '700',
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginTop: 6,
  },

  subtitle: {
    color: '#e5e7eb',
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
  },

  listContent: {
    padding: 16,
    paddingBottom: 120,
  },

  row: {
    backgroundColor: '#1e1e1e',
    padding: 14,
    borderRadius: 10,
  },

  rowTitle: {
    color: '#fff',
    fontWeight: '700',
  },

  rowDesc: {
    color: '#aaa',
    marginTop: 4,
  },
  rowImageWrapper: {
    marginTop: 6,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  rowImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  rowMeta: {
    marginTop: 6,
  },
  rowMetaText: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },

  separator: { height: 10 },

  emptyWrap: {
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },

  emptyText: {
    color: '#e5e7eb',
    textAlign: 'center',
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
