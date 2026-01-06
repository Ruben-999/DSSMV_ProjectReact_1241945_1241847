import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Lembrete } from '../redux/types';

// Dados do SupaBase Storage
const SUPABASE_PROJECT_ID = 'qrcsmtgswmlpcyivsquu'; 
const BUCKET_NAME = 'lembretes-fotos';

interface Props {
  item: Lembrete;
  onToggleConcluido: (id: string, novoEstado: boolean) => void;
  onPress: (item: Lembrete) => void;
}

const LembreteItem: React.FC<Props> = ({ item, onToggleConcluido, onPress }) => {

  const setPrioridadeColor = () => {
    if (item.prioridade === 3) return '#ff6b6b';
    if (item.prioridade === 2) return '#fde047';
    return '#30D158'; 
  };

  // Função auxiliar para construir o URL da imagem
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    // Se por acaso já guardamos o URL completo (começa por http), usa-o direto
    if (path.startsWith('http')) return path;
    
    // Constrói o URL público do Supabase
    return `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  const imageUrl = getImageUrl(item.foto_url);

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      {/* Coluna Esquerda: Checkbox */}
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

      {/* Coluna Central: Texto e Imagem */}
      <View style={styles.contentContainer}>
        
        {/* Título */}
        <Text 
          style={[styles.title, item.concluido && styles.completedText]} 
          numberOfLines={1}
        >
          {item.titulo}
        </Text>
        
        {/* Descrição */}
        {item.descricao ? (
          <Text 
            style={[styles.description, item.concluido && styles.completedText]} 
            numberOfLines={2}
          >
            {item.descricao}
          </Text>
        ) : null}

        {/* ---FOTO ANEXADA --- */}
        {imageUrl && (
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: imageUrl }} 
              style={[styles.attachedImage, item.concluido && { opacity: 0.5 }]} 
            />
          </View>
        )}

        {/* Metadados (Data e Prioridade) */}
        <View style={styles.metaContainer}>
           {item.data_hora && (
             <Text style={styles.metaText}>
               📅 {new Date(item.data_hora).toLocaleDateString()}
             </Text>
           )}
           {item.prioridade > 0 && (
             <Text style={[styles.metaText, { color: setPrioridadeColor() }]}>
               {!item.data_hora ? '🚩' : ' • 🚩'} P{item.prioridade}
             </Text>
           )}
        </View>
      </View>

      {/* Coluna Direita: Seta */}
      <Ionicons name="chevron-forward" size={20} color="#444" style={styles.chevron} />
      
    </TouchableOpacity>
  );
};

export default LembreteItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Alinhado ao topo para suportar conteúdo variável
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 16, // Mais arredondado
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  checkContainer: {
    marginRight: 16,
    marginTop: 2, // Pequeno ajuste para alinhar com o título
  },
  contentContainer: {
    flex: 1, // Ocupa o espaço central todo
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
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#5b5b5bff',
  },
  // --- Estilos da Imagem ---
  imageWrapper: {
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a', // Fundo enquanto carrega
  },
  attachedImage: {
    width: '100%',
    height: 150, // Altura fixa para manter consistência
    resizeMode: 'cover',
  },
  // -------------------------
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#666',
    fontSize: 12,
    marginRight: 8,
  },
  chevron: {
    marginTop: 4, // Alinhar com o título visualmente
    marginLeft: 8,
  }
});