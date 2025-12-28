import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LembreteItem from '../../components/LembreteItem';
import { updateLembrete } from '../../redux/actions/lembreteActions';

const LembretesListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  
  // Recebe o filtro enviado pelo HomeScreen (hoje, agendado, concluido, todos)
  const { filterType, filterTitle } = route.params || {};

  const { items: lembretes } = useSelector((state: RootState) => state.lembretes);

  // --- LÓGICA DE FILTRAGEM (Igual à do Home) ---
  const filteredLembretes = lembretes.filter(l => {
    const hojeString = new Date().toISOString().split('T')[0];
    
    // Tratamento de datas
    const dataLembrete = l.data_hora ? l.data_hora.split('T')[0] : null;

    switch (filterType) {
      case 'concluido':
        return l.concluido === true;
      
      case 'todos':
        return l.concluido === false; // A tua regra: Todos = Todos os abertos
      
      case 'hoje':
        return !l.concluido && dataLembrete === hojeString;
      
      case 'agendado':
        return !l.concluido && dataLembrete && dataLembrete !== hojeString;
      
      default:
        return true;
    }
  });

  // Ordenar: Prioridade mais alta primeiro, depois data mais próxima
  const sortedLembretes = filteredLembretes.sort((a, b) => {
      if (b.prioridade !== a.prioridade) return b.prioridade - a.prioridade;
      // Se tiver data, ordena por data
      if (a.data_hora && b.data_hora) return a.data_hora.localeCompare(b.data_hora);
      return 0;
  });

  // Ações
  const handleToggle = (id: string, currentStatus: boolean) => {
    dispatch(updateLembrete(id, { concluido: currentStatus }) as any);
  };

  const handleEdit = (item: any) => {
    // Por enquanto apenas um log, na próxima interação fazemos a tela de edição
    console.log("Abrir edição para:", item.titulo);
    // navigation.navigate('EditLembrete', { lembrete: item }); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Simples */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{filterTitle || 'Lembretes'}</Text>
        <View style={{width: 24}} /> {/* Espaço para centrar o título */}
      </View>

      <FlatList
        data={sortedLembretes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <LembreteItem 
            item={item} 
            onToggleConcluido={handleToggle}
            onPress={handleEdit}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={60} color="#333" />
            <Text style={styles.emptyText}>Nenhum lembrete aqui.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default LembretesListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  listContent: { padding: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#5b5a5aff', marginTop: 10, fontSize: 16 }
});