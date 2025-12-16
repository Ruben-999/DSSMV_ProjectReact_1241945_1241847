import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';

// Presentational List Details screen. Reads list and reminders from Redux.
// No side-effects or data fetching here — expects data to be available.

const ListDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { listaId } = route.params || {};

  const lista = useSelector((s: RootState) =>
    s.listas.items.find((l) => String(l.id) === String(listaId))
  );

  const lembretes = useSelector((s: RootState) =>
    s.lembretes.items.filter((lm) => String(lm.lista_id) === String(listaId))
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.reminderRow}>
      <Text style={styles.reminderTitle}>{item.titulo}</Text>
      {item.descricao ? <Text style={styles.reminderSubtitle}>{item.descricao}</Text> : null}
    </View>
  );

  if (!lista) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Lista não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{lista.nome}</Text>
      </View>

      {lembretes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Sem lembretes nesta lista</Text>
          <Text style={styles.emptyText}>Toque no + para criar um lembrete.</Text>
        </View>
      ) : (
        <FlatList
          data={lembretes}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateLembrete', { listaId })}
        accessibilityLabel="Adicionar lembrete"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#111' },
  back: { color: '#6c2cff', marginBottom: 8 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  listContent: { padding: 16, paddingBottom: 120 },
  reminderRow: { padding: 12, backgroundColor: '#0b0b0b', borderRadius: 8 },
  reminderTitle: { color: '#fff', fontWeight: '600' },
  reminderSubtitle: { color: '#9a9a9a', marginTop: 4 },
  separator: { height: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: '#999' },
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
