import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useNavigation } from '@react-navigation/native';

// Presentational Lists Overview Screen
// Reuses Redux shape: `state.listas.items` and `state.lembretes.items`.
// No side effects or data fetching here; the screen expects lists to be
// provided by higher-level logic (e.g., an effect on a parent or bootstrapping).

const ListsOverviewScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const listas = useSelector((s: RootState) => s.listas.items);
  const lembretes = useSelector((s: RootState) => s.lembretes.items);

  const renderItem = ({ item }: { item: any }) => {
    const remindersCount = lembretes.filter(
      (l) => String(l.lista_id) === String(item.id)
    ).length;

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('ListDetails', { listaId: item.id })}
        accessibilityLabel={`Abrir lista ${item.nome}`}
      >
        <View style={styles.rowText}>
          <Text style={styles.title}>{item.nome}</Text>
          {item.descricao ? (
            <Text style={styles.subtitle}>{item.descricao}</Text>
          ) : null}
        </View>

        <View style={styles.meta}>
          <Text style={styles.count}>{remindersCount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (!listas || listas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhuma lista encontrada</Text>
        <Text style={styles.emptyText}>Crie a sua primeira lista para começar.</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateLista')}
          accessibilityLabel="Criar nova lista"
        >
          <Text style={styles.createButtonText}>Criar lista</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listas}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateLista')}
        accessibilityLabel="Adicionar nova lista"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListsOverviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  listContent: { padding: 16, paddingBottom: 120 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#0b0b0b',
    borderRadius: 10,
  },
  rowText: { flex: 1, paddingRight: 8 },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#9a9a9a', marginTop: 4 },
  meta: { width: 36, alignItems: 'center' },
  count: { color: '#fff', fontWeight: '700' },
  separator: { height: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8 },
  emptyText: { color: '#999', textAlign: 'center', marginBottom: 16 },
  createButton: { backgroundColor: '#6c2cff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  createButtonText: { color: '#fff', fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6c2cff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '700' },
});
