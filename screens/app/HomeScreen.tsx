import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CategoryChip from '../../components/CategoryChip';
import StatsCard from '../../components/StatsCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useNavigation } from '@react-navigation/native';

// Presentational-first Home screen. No data fetching or navigation here —
// UI only, easy to integrate with Redux or navigation later.
const categories = [
  { id: '1', label: 'Work' },
  { id: '2', label: 'Personal' },
  { id: '3', label: 'Shopping' },
  { id: '4', label: 'Health' },
];

const stats = [
  { id: 'Hoje', label: 'Hoje', value: 3 },
  { id: 'Agendado', label: 'Agendado', value: 5 },
  { id: 'Concluído', label: 'Concluído', value: 12 },
];

const HomeScreen: React.FC = () => {
  // Local UI state only — keeps this component presentational and predictable.
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);
  // Read the real count of listas from Redux store. Keeps component presentational
  // while using global state as read-only input.
  const listasCount = useSelector((state: RootState) => state.listas.items.length);
  const navigation = useNavigation<any>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá</Text>
        <Text style={styles.subtitle}>Bem-vindo de volta</Text>
      </View>

      <View style={styles.statsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScroll}
        >
          {stats.map((s) => (
            <View key={s.id} style={styles.statsItem}>
              <StatsCard value={s.value} label={s.label} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              // Navigate to CreateCategoria screen (presentational)
              navigation.navigate('CreateCategoria');
            }}
            accessibilityLabel="Adicionar categoria"
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

      <TouchableOpacity
        style={styles.listasContainer}
        onPress={() => navigation.navigate('ListsOverview')}
        accessibilityLabel="Abrir listas"
      >
        <Text style={styles.listasTitle}>Listas</Text>
        <View style={styles.listasBadge}>
          <Text style={styles.listasBadgeText}>{listasCount}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    color: '#aaa',
    marginTop: 6,
  },
  statsWrapper: {
    marginBottom: 20,
  },
  statsScroll: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  statsItem: {
    width: 140,
    marginRight: 12,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsScroll: {
    paddingVertical: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#6c2cff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
  },
  listasContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#0b0b0b',
    borderRadius: 12,
    marginTop: 16,
  },
  listasTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  listasBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6c2cff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  listasBadgeText: {
    color: '#fff',
    fontWeight: '700',
  },
});
