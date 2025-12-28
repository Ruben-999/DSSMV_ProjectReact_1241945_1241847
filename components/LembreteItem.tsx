import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lembrete } from '../redux/types';

interface Props {
  item: Lembrete;
  onToggleConcluido: (id: string, novoEstado: boolean) => void;
  onPress: (item: Lembrete) => void;
}

const LembreteItem: React.FC<Props> = ({ item, onToggleConcluido, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(item)} // Clicar no corpo para abrir detalhes/editar
      activeOpacity={0.7}
    >
      {/* Botão Checkbox (Concluir) */}
      <TouchableOpacity 
        style={styles.checkContainer} 
        onPress={() => onToggleConcluido(item.id, !item.concluido)}
      >
        <Ionicons 
          name={item.concluido ? "checkmark-circle" : "ellipse-outline"} 
          size={28} 
          color={item.concluido ? "#86efac" : "#6c2cff"} 
        />
      </TouchableOpacity>

      {/* Conteúdo de Texto */}
      <View style={styles.textContainer}>
        <Text 
          style={[styles.title, item.concluido && styles.completedText]} 
          numberOfLines={1}
        >
          {item.titulo}
        </Text>
        
        {item.descricao ? (
          <Text 
            style={[styles.description, item.concluido && styles.completedText]} 
            numberOfLines={2}
          >
            {item.descricao}
          </Text>
        ) : null}

        {/* Pequena info extra (Data ou Prioridade) */}
        <View style={styles.metaContainer}>
           {item.data_hora && (
             <Text style={styles.metaText}>
               📅 {new Date(item.data_hora).toLocaleDateString()}
             </Text>
           )}
           {item.prioridade > 0 && (
             <Text style={[styles.metaText, { color: item.prioridade === 3 ? '#ff6b6b' : '#fde047' }]}>
               {!item.data_hora ? '🚩' : ' • 🚩'} P{item.prioridade}
             </Text>
           )}
        </View>
      </View>

      {/* Seta indicando que é clicável */}
      <Ionicons name="chevron-forward" size={20} color="#444" />
      
    </TouchableOpacity>
  );
};

export default LembreteItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  checkContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#5b5b5bff',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#666',
    fontSize: 12,
    marginRight: 8,
  }
});