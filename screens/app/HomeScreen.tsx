import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../redux/reducers';
import { logoutUser } from '../../redux/actions/authActions';
import {
  setCategoriaAtiva,
  deleteCategoria,
  loadCategoriaAtiva,
  fetchCategorias
} from '../../redux/actions/categoriaActions';
import { fetchLembretes } from '../../redux/actions/lembreteActions';
import { fetchListas } from '../../redux/actions/listaActions';

import CategoryChip from '../../components/CategoryChip';
import StatsCard from '../../components/StatsCard';

const ID_TODOS = 'todos';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const user = useSelector((s: RootState) => s.auth.user);
  const listasCount = useSelector((s: RootState) => s.listas.items.length);

  const categorias = useSelector((s: RootState) => s.categorias.items);
  const categoriaAtivaId = useSelector(
    (s: RootState) => s.categorias.categoriaAtivaId
  );

  const lembretes = useSelector((s: RootState) => s.lembretes.items);

  const userId = useSelector((s: RootState) => s.auth.user?.id);

useEffect(() => {
  if (!userId) return;

  dispatch(fetchCategorias(userId) as any);
  dispatch(fetchListas(userId) as any);
  dispatch(fetchLembretes(userId) as any);
}, [userId, dispatch]);

  const [deleteMode, setDeleteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDeleteIds, setSelectedDeleteIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(loadCategoriaAtiva() as any);
  }, [dispatch]);

  // categorias + "Todos" (virtual)
  const categoriasComTodos = useMemo(() => {
    const semTodos = categorias.filter(c => String(c.id) !== ID_TODOS);
    return [{ id: ID_TODOS, nome: 'Todos' }, ...semTodos];
  }, [categorias]);

  // filtro global
  const lembretesFiltrados = useMemo(() => {
    if (!categoriaAtivaId || categoriaAtivaId === ID_TODOS) return lembretes;
    return lembretes.filter(
      l => String(l.categoria_id) === String(categoriaAtivaId)
    );
  }, [lembretes, categoriaAtivaId]);

  const hoje = new Date().toISOString().split('T')[0];

  const stats = useMemo(
    () => [
      {
        id: 'hoje',
        label: 'Hoje',
        value: lembretesFiltrados.filter(
          l => l.data_hora?.startsWith(hoje) && !l.concluido
        ).length,
      },
      {
        id: 'agendado',
        label: 'Agendados',
        value: lembretesFiltrados.filter(
          l => !l.concluido && l.data_hora
        ).length,
      },
      {
        id: 'concluido',
        label: 'Concluídos',
        value: lembretesFiltrados.filter(l => l.concluido).length,
      },
      {
        id: 'todos',
        label: 'Todos',
        value: lembretesFiltrados.length,
      },
    ],
    [lembretesFiltrados, hoje]
  );

  const exitModes = () => {
    setDeleteMode(false);
    setEditMode(false);
    setSelectedDeleteIds([]);
  };

  const handleCategoriaPress = (id: string) => {
    const isTodos = id === ID_TODOS;

    if (deleteMode) {
      if (isTodos) {
        Alert.alert('Protegido', '"Todos" não pode ser apagado.');
        return;
      }
      setSelectedDeleteIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
      return;
    }

    if (editMode) {
      if (isTodos) {
        Alert.alert('Protegido', '"Todos" não pode ser editado.');
        return;
      }
      navigation.navigate('EditCategoria', { categoriaId: id });
      return;
    }

    dispatch(setCategoriaAtiva(id) as any);
  };

  const confirmDeleteCategorias = () => {
  if (selectedDeleteIds.length === 0) return;

  Alert.alert(
    'Eliminar categorias',
    `Eliminar ${selectedDeleteIds.length} categoria(s)?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          for (const id of selectedDeleteIds) {
            await dispatch(deleteCategoria(id) as any);
          }

          if (userId) {
            dispatch(fetchCategorias(userId) as any);
            dispatch(fetchLembretes(userId) as any);
            dispatch(fetchListas(userId) as any);
          }

          exitModes();
        },
      },
    ]
  );
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Olá, {user?.nome || 'Utilizador'}
            </Text>
            <Text style={styles.subtitle}>Bem-vindo de volta</Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert('Sair', 'Tens a certeza?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                  text: 'Sair',
                  style: 'destructive',
                  onPress: () => dispatch(logoutUser() as any),
                },
              ])
            }
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <View style={styles.gridContainer}>
          {stats.map(s => (
            <View key={s.id} style={styles.gridItem}>
              <StatsCard value={s.value} label={s.label} />
            </View>
          ))}
        </View>

        {/* CATEGORIAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Categorias</Text>

            <View style={styles.catActions}>
              <TouchableOpacity
                style={[styles.iconBtn, styles.iconBtnGreen]}
                onPress={() => navigation.navigate('CreateCategoria')}
              >
                <Ionicons name="add" size={18} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  styles.iconBtnRed,
                  deleteMode && styles.iconBtnActive,
                ]}
                onPress={() => (deleteMode ? exitModes() : setDeleteMode(true))}
              >
                <Ionicons name="remove" size={18} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.iconBtn,
                  styles.iconBtnYellow,
                  editMode && styles.iconBtnActive,
                ]}
                onPress={() => (editMode ? exitModes() : setEditMode(true))}
              >
                <Ionicons name="pencil" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categoriasComTodos.map(c => {
              const id = String(c.id);
              const isTodos = id === ID_TODOS;

              return (
                <CategoryChip
                  key={id}
                  label={c.nome}
                  active={!deleteMode && !editMode && id === categoriaAtivaId}
                  danger={deleteMode && selectedDeleteIds.includes(id)}
                  disabled={(deleteMode || editMode) && isTodos}
                  onPress={() => handleCategoriaPress(id)}
                />
              );
            })}
          </ScrollView>

          {deleteMode && (
            <View style={styles.deleteBar}>
              <TouchableOpacity onPress={exitModes}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={selectedDeleteIds.length === 0}
                onPress={confirmDeleteCategorias}
              >
                <Text
                  style={[
                    styles.deleteText,
                    selectedDeleteIds.length === 0 && { opacity: 0.4 },
                  ]}
                >
                  Eliminar ({selectedDeleteIds.length})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {editMode && (
            <View style={styles.editBar}>
              <Text style={styles.editHint}>
                Seleciona uma categoria para editar (exceto “Todos”).
              </Text>
              <TouchableOpacity onPress={exitModes}>
                <Text style={styles.cancelText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* LISTAS */}
        <TouchableOpacity
          style={styles.listasContainer}
          onPress={() => navigation.navigate('ListsOverview')}
        >
          <Text style={styles.listasTitle}>Minhas Listas</Text>
          <View style={styles.listasBadge}>
            <Text style={styles.listasBadgeText}>{listasCount}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB CRIAR LEMBRETE */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateLembrete')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 16, paddingBottom: 120 },

  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 28, fontWeight: '700', color: '#fff' },
  subtitle: { color: '#aaa', marginTop: 4, fontSize: 14 },

  logoutButton: {
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  logoutText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 12 },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridItem: { width: '48%', marginBottom: 16 },

  section: { marginBottom: 20 },
  sectionTitle: { color: '#fff', fontWeight: '600', fontSize: 18 },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  catActions: { flexDirection: 'row', gap: 12 },

  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: { transform: [{ scale: 1.02 }] },
  iconBtnGreen: { backgroundColor: '#22c55e' },
  iconBtnRed: { backgroundColor: '#ef4444' },
  iconBtnYellow: { backgroundColor: '#facc15' },

  deleteBar: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelText: { color: '#aaa', fontSize: 14 },
  deleteText: { color: '#ef4444', fontWeight: 'bold', fontSize: 14 },

  editBar: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  editHint: { color: '#aaa', fontSize: 12, flex: 1 },

  listasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  listasTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  listasBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6c2cff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  listasBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6c2cff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6c2cff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
});
