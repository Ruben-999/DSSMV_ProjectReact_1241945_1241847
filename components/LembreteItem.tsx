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
    return '#22c55e';
  };

  const getPrioridadeLabel = () => {
    if (item.prioridade === 3) return 'Alta';
    if (item.prioridade === 2) return 'Média';
    return 'Baixa';
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  const imageUrl = getImageUrl(item.foto_url);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        style={styles.checkContainer}
        onPress={() => onToggleConcluido(item.id, !item.concluido)}
      >
        <Ionicons
          name={item.concluido ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={item.concluido ? '#86efac' : '#6c2cff'}
        />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            item.prioridade > 0 && { color: setPrioridadeColor() },
            item.concluido && styles.completedText,
          ]}
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

        {imageUrl && (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={[styles.attachedImage, item.concluido && { opacity: 0.5 }]}
            />
          </View>
        )}

        <View style={styles.metaContainer}>
          {item.data_hora && (
            <Text style={styles.metaText}>
              Data: {new Date(item.data_hora).toLocaleDateString()}
            </Text>
          )}
          {item.prioridade > 0 && (
            <Text style={[styles.metaText, { color: setPrioridadeColor() }]}>
              Prioridade: {getPrioridadeLabel()}
            </Text>
          )}
          {item.local_latitude != null && item.local_longitude != null && (
            <Text style={styles.metaText}>
              Local: {item.local_latitude.toFixed(4)}, {item.local_longitude.toFixed(4)}
            </Text>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#444" style={styles.chevron} />
    </TouchableOpacity>
  );
};

export default LembreteItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  checkContainer: {
    marginRight: 16,
    marginTop: 2,
  },
  contentContainer: {
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
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#5b5b5bff',
  },
  imageWrapper: {
    marginTop: 6,
    marginBottom: 6,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  attachedImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  metaContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  metaText: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    marginTop: 4,
    marginLeft: 8,
  },
});