import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store/store';
import { RootState } from '../../redux/reducers';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { deleteLista } from '../../redux/actions/listaActions';

const ID_TODOS = 'todos';
const ID_SEM_LISTA = 'sem_lista';

const ListsOverviewScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const listas = useSelector((s: RootState) => s.listas.items);
  const lembretes = useSelector((s: RootState) => s.lembretes.items);
  const categoriaAtivaId = useSelector(
    (s: RootState) => s.categorias.categoriaAtivaId
  );

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 🔹 FILTRO GLOBAL POR CATEGORIA
  const lembretesFiltrados = useMemo(() => {
    return categoriaAtivaId === ID_TODOS
      ? lembretes
      : lembretes.filter(
          l => String(l.categoria_id) === String(categoriaAtivaId)
        );
  }, [lembretes, categoriaAtivaId]);

  const getCount = (listaId: string, isDefault: boolean) => {
    if (isDefault) {
      return lembretesFiltrados.filter(l => !l.lista_id).length;
    }
    return lembretesFiltrados.filter(
      l => String(l.lista_id) === String(listaId)
    ).length;
  };

  const listasComDefault = useMemo(() => {
    const temDefault = listas.some(l => l.is_default);
    if (temDefault) return listas;
    return [
      {
        id: ID_SEM_LISTA,
        nome: 'Sem Lista',
        is_default: true,
        cor_hex: '#1e1e1e',
      },
      ...listas,
    ];
  }, [listas]);

  const toggleSelect = (id: string, isDefault: boolean) => {
    if (isDefault) {
      Alert.alert(
        'Ação inválida',
        'A lista default não pode ser eliminada.'
      );
      return;
    }

    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const confirmBulkDelete = () => {
    if (selectedIds.size === 0) {
      exitSelectionMode();
      return;
    }

    Alert.alert(
      'Eliminar listas',
      `Eliminar ${selectedIds.size} lista(s)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            selectedIds.forEach(id =>
              dispatch(deleteLista(id))
            );
            exitSelectionMode();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const id = String(item.id);
    const isSelected = selectedIds.has(id);
    const count = getCount(id, item.is_default);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor:
              item.cor_hex ?? '#1e1e1e',
          },
          isSelected && styles.cardSelected,
        ]}
        onLongPress={() => {
          if (!selectionMode) {
            setSelectionMode(true);
            toggleSelect(id, item.is_default);
          }
        }}
        onPress={() => {
          if (selectionMode) {
            toggleSelect(id, item.is_default);
          } else {
            navigation.navigate('ListDetails', {
              listaId: item.is_default ? ID_SEM_LISTA : item.id,
            });
          }
        }}
      >
        <View>
          <Text style={styles.cardTitle}>{item.nome}</Text>
          <Text style={styles.cardCount}>
            {count} lembrete(s)
          </Text>
        </View>

        {!selectionMode && (
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#e5e7eb"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Listas</Text>

        {!selectionMode && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreateLista')}
          >
            <Ionicons name="add" size={22} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      {selectionMode && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionText}>
            {selectedIds.size} selecionada(s)
          </Text>

          <TouchableOpacity onPress={confirmBulkDelete}>
            <Text style={styles.deleteAction}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={exitSelectionMode}>
            <Text style={styles.cancelAction}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={listasComDefault}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
      />
    </SafeAreaView>
  );
};

export default ListsOverviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  selectionText: {
    color: '#fff',
    fontWeight: '600',
  },

  deleteAction: {
    color: '#ef4444',
    fontWeight: '700',
  },

  cancelAction: {
    color: '#aaa',
    fontWeight: '600',
  },

  listContent: { padding: 16 },

  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },

  cardTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  cardCount: {
    color: '#e5e7eb',
    marginTop: 6,
  },

  separator: { height: 12 },
});
