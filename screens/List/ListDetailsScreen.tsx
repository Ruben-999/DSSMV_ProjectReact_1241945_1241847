import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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

const ListDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { listaId } = route.params as RouteParams;

  const lista = useSelector((s: RootState) =>
    s.listas.items.find((l) => String(l.id) === String(listaId))
  );

  const lembretes = useSelector((s: RootState) => s.lembretes.items);

  // ✅ FIX DE TIPAGEM AQUI
  const categoriaAtivaId = useSelector(
    (s: RootState) => (s.categorias as any).categoriaAtivaId
  );

  const lembretesFiltrados = useMemo(() => {
    return lembretes.filter((l) => {
      if (String(l.lista_id) !== String(listaId)) return false;
      if (categoriaAtivaId === ID_TODOS) return true;
      return String(l.categoria_id) === String(categoriaAtivaId);
    });
  }, [lembretes, listaId, categoriaAtivaId]);

  if (!lista) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Lista não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('EditList', { listaId })}
        >
          <Ionicons name="pencil" size={20} color="#facc15" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{lista.nome}</Text>
      {lista.descricao ? (
        <Text style={styles.subtitle}>{lista.descricao}</Text>
      ) : null}

      {lembretesFiltrados.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Sem lembretes nesta lista</Text>
          <Text style={styles.emptyText}>
            Não existem lembretes para esta categoria.
          </Text>
        </View>
      ) : (
        <FlatList
          data={lembretesFiltrados}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rowTitle}>{item.titulo}</Text>
              {item.descricao ? (
                <Text style={styles.rowDesc}>{item.descricao}</Text>
              ) : null}
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateLembrete', { listaId })}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ListDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: { color: '#6c2cff', fontWeight: '600' },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    paddingHorizontal: 16,
    marginTop: 6,
  },
  subtitle: {
    color: '#aaa',
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
  },
  listContent: { padding: 16, paddingBottom: 120 },
  row: {
    backgroundColor: '#1e1e1e',
    padding: 14,
    borderRadius: 10,
  },
  rowTitle: { color: '#fff', fontWeight: '700' },
  rowDesc: { color: '#aaa', marginTop: 4 },
  separator: { height: 10 },
  emptyWrap: { padding: 24, alignItems: 'center' },
  emptyTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  emptyText: { color: '#999', textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6c2cff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
