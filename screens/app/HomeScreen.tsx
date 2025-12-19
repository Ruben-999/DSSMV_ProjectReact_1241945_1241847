import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../../redux/actions/authActions';
import { fetchLembretes } from '../../redux/actions/lembreteActions'; 
import { Ionicons } from '@expo/vector-icons';

// Componentes
import CategoryChip from '../../components/CategoryChip';
import StatsCard from '../../components/StatsCard';

const categoriesPlaceholder = [
  { id: '1', label: 'Trabalho' },
  { id: '2', label: 'Pessoal' },
  { id: '3', label: 'Compras' },
  { id: '4', label: 'Saúde' },
];

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categoriesPlaceholder[0].id);
  
  // 1. Dados do Redux
  const user = useSelector((state: RootState) => state.auth.user);
  const { items: lembretes } = useSelector((state: RootState) => state.lembretes); 
  const listasCount = useSelector((state: RootState) => state.listas.items.length);

  // Categorias
  const categoriasReais = useSelector((state: RootState) => state.categorias?.items) || [];
  const categoriesDisplay = categoriasReais.length > 0 ? categoriasReais.map(c => ({id: c.id.toString(), label: c.nome})) : categoriesPlaceholder;

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  // 2. BUSCAR DADOS
  useEffect(() => {
    if (user?.id) {
        dispatch(fetchLembretes(user.id) as any);
    }
  }, [dispatch, user?.id]);

  // 3. ESTATÍSTICAS
  const hojeString = new Date().toISOString().split('T')[0]; 

  const countConcluidos = lembretes.filter(l => l.concluido).length;
  const countTodos = lembretes.filter(l => !l.concluido).length;

  const countHoje = lembretes.filter(l => {
    if (l.concluido || !l.data_hora) return false;
    return l.data_hora.split('T')[0] === hojeString;
  }).length;

  const countAgendados = lembretes.filter(l => {
    if (l.concluido || !l.data_hora) return false;
    return l.data_hora.split('T')[0] !== hojeString;
  }).length;

  const stats = [
    { id: 'hoje', label: 'Hoje', value: countHoje, color: '#fca5a5' }, 
    { id: 'agendado', label: 'Agendados', value: countAgendados, color: '#fde047' }, 
    { id: 'concluido', label: 'Concluídos', value: countConcluidos, color: '#86efac' }, 
    { id: 'todos', label: 'Todos', value: countTodos, color: '#93c5fd' }, 
  ];

  // Navegação
  const handleStatPress = (statId: string, label: string) => {
    navigation.navigate('LembretesList', { 
      filterType: statId,   
      filterTitle: label    
    });
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Tens a certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => dispatch(logoutUser() as any) }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.nome || 'Utilizador'}</Text>
            <Text style={styles.subtitle}>Bem-vindo de volta</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={20} color="#ff6b6b" />
          </TouchableOpacity>
        </View>

        {/* GRID STATS */}
        <View style={styles.gridContainer}>
          {stats.map((s) => (
            <TouchableOpacity 
              key={s.id} 
              style={styles.gridItem} 
              activeOpacity={0.7}
              onPress={() => handleStatPress(s.id, s.label)}
            >
              <StatsCard value={s.value} label={s.label} />
            </TouchableOpacity>
          ))}
        </View>

        {/* CATEGORIAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateCategoria')}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {categoriesDisplay.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.label}
                active={selectedCategory === c.id}
                onPress={() => setSelectedCategory(c.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* LISTAS */}
        <TouchableOpacity style={styles.listasContainer} onPress={() => navigation.navigate('ListsOverview')}>
          <Text style={styles.listasTitle}>Minhas Listas</Text>
          <View style={styles.listasBadge}>
            <Text style={styles.listasBadgeText}>{listasCount}</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>

      {/* FAB (Botão Lembretes) */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateLembrete')}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default HomeScreen;

// Os estilos mantêm-se iguais
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  content: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 28, fontWeight: '700', color: '#fff' },
  subtitle: { color: '#aaa', marginTop: 4, fontSize: 14 },
  logoutButton: { padding: 8, backgroundColor: '#2a2a2a', borderRadius: 8 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  gridItem: { width: '48%', marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { color: '#fff', fontWeight: '600', fontSize: 18, marginBottom: 8 },
  chipsScroll: { paddingVertical: 4 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  addButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#6c2cff', alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 20 },
  listasContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#1e1e1e', borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  listasTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  listasBadge: { minWidth: 28, height: 28, borderRadius: 14, backgroundColor: '#6c2cff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  listasBadgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#6c2cff', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#6c2cff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 }
});