import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CategoryChip } from '../../components';
import {
  selectAllLembretes,
  selectLembretesHoje,
  selectLembretesConcluidos,
  selectCategorias,
  selectUserId,
} from '../../redux/selectors';
import { fetchCategorias } from '../../redux/actions/categoriaActions';
import { useNavigation } from '@react-navigation/native';
import type { AppDispatch } from '../../redux/store/store';

const userId = useSelector(selectUserId);
const dispatch = useDispatch<AppDispatch>();
useEffect(() => {
  if (userId) {
    dispatch(fetchCategorias(userId));
  }
}, [dispatch, userId]);
const navigation = useNavigation();

const HomeScreen = () => {
  // 🔹 Redux state
  const lembretes = useSelector(selectAllLembretes);
  const lembretesHoje = useSelector(selectLembretesHoje);
  const lembretesConcluidos = useSelector(selectLembretesConcluidos);
  const categorias = useSelector(selectCategorias);

  // 🔹 FILTRO POR CATEGORIA (AQUI)
  const lembretesFiltrados = activeCategoriaId
  ? lembretes.filter(
      lembrete => lembrete.categoriaId === activeCategoriaId
    )
  : lembretes;


  // 🔹 UI state
  const [activeCategoriaId, setActiveCategoriaId] = useState<string | null>(null);

 const dispatch = useDispatch<AppDispatch>();

  // 🔹 Load categorias on mount
  useEffect(() => {
  if (userId) {
    dispatch(fetchCategorias(userId));
  }
}, [dispatch, userId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{lembretesHoje.length}</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{lembretes.length}</Text>
            <Text style={styles.statLabel}>Agendados</Text>
          </View>
        </View>

        <View style={styles.statBoxLarge}>
          <Text style={styles.statNumber}>{lembretesConcluidos.length}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>
      </View>

      {/* Categorias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoryRow}>
            <CategoryChip
              label="Todas"
              active={activeCategoriaId === null}
              onPress={() => setActiveCategoriaId(null)}
            />

            {categorias.map(categoria => (
              <CategoryChip
                key={categoria.id}
                label={categoria.name}
                active={activeCategoriaId === categoria.id}
                onPress={() => setActiveCategoriaId(categoria.id)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Botão Novo Lembrete */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateLembrete' as never)}>
        <Text style={styles.addButtonText}>+ Novo lembrete</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },

  header: {
    marginBottom: 24,
  },

  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff2d2d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  statBox: {
    backgroundColor: '#111',
    flex: 1,
    marginRight: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  statBoxLarge: {
    backgroundColor: '#111',
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  statNumber: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  statLabel: {
    color: '#aaa',
    marginTop: 4,
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  categoryRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  addButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#6c2cff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
