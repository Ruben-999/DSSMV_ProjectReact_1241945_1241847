import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Proteção contra notch
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../../redux/actions/authActions'; // Ação de logout

// Componentes (Assumindo que eles existem e aceitam onPress/style)
import CategoryChip from '../../components/CategoryChip';
import StatsCard from '../../components/StatsCard';

const categories = [
  { id: '1', label: 'Trabalho' },
  { id: '2', label: 'Pessoal' },
  { id: '3', label: 'Compras' },
  { id: '4', label: 'Saúde' },
];

const stats = [
  { id: 'hoje', label: 'Hoje', value: 3, color: '#fca5a5' }, // Exemplo de cor
  { id: 'agendado', label: 'Agendados', value: 5, color: '#fde047' },
  { id: 'concluido', label: 'Concluídos', value: 12, color: '#86efac' },
  { id: 'todos', label: 'Todos', value: 20, color: '#93c5fd' }, // Novo bloco
];

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);

  // Redux Data
  const user = useSelector((state: RootState) => state.auth.user);
  const listasCount = useSelector((state: RootState) => state.listas.items.length);

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert("Sair", "Tens a certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => dispatch(logoutUser() as any) }
    ]);
  };

  const handleStatPress = (statId: string) => {
    console.log(`Clicou em: ${statId}`);
    // Futuramente: navigation.navigate('LembretesList', { filter: statId });
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
          {/* Botão de Logout Temporário para testes */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* GRID 2x2 DE STATS */}
        <View style={styles.gridContainer}>
          {stats.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.gridItem}
              onPress={() => handleStatPress(s.id)}
              activeOpacity={0.7}
            >
              {/* Assumindo que o StatsCard aceita estilos ou ajusta-se ao pai */}
              <StatsCard value={s.value} label={s.label} />
            </TouchableOpacity>
          ))}
        </View>

        {/* SECÇÃO CATEGORIAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateCategoria')}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {categories.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.label}
                active={selectedCategory === c.id}
                onPress={() => setSelectedCategory(c.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* BOTÃO LISTAS */}
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
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Cor de fundo escura (ajusta conforme o teu tema)
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    color: '#aaa',
    marginTop: 4,
    fontSize: 14,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  logoutText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Grid Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite quebra de linha
    justifyContent: 'space-between', // Espaçamento entre colunas
    marginBottom: 24,
  },
  gridItem: {
    width: '48%', // Quase metade para caber 2 lado a lado
    marginBottom: 16, // Espaço vertical entre linhas
  },

  // Categories
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 8,
  },
  chipsScroll: {
    paddingVertical: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6c2cff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },

  // Listas Button
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
  listasTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  listasBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6c2cff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  listasBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
