import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { RootState } from '../../redux/reducers';

// Dados do SupaBase Storage
const SUPABASE_PROJECT_ID = 'qrcsmtgswmlpcyivsquu';
const BUCKET_NAME = 'lembretes-fotos';

type RouteParams = {
  lembreteId: string;
};

const LembreteScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { lembreteId } = route.params as RouteParams;

  const lembrete = useSelector((s: RootState) =>
    s.lembretes.items.find(l => String(l.id) === String(lembreteId))
  );

  const lista = useSelector((s: RootState) =>
    s.listas.items.find(l => String(l.id) === String(lembrete?.lista_id))
  );

  const categoria = useSelector((s: RootState) =>
    s.categorias.items.find(c => String(c.id) === String(lembrete?.categoria_id))
  );

  const getPrioridadeColor = (prioridade: number) => {
    if (prioridade === 3) return '#ff6b6b';
    if (prioridade === 2) return '#fde047';
    return '#22c55e';
  };

  const getPrioridadeLabel = (prioridade: number) => {
    if (prioridade === 3) return 'Alta';
    if (prioridade === 2) return 'M�dia';
    return 'Baixa';
  };

  const getImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${path}`;
  };

  if (!lembrete) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>Lembrete nao encontrado.</Text>
      </SafeAreaView>
    );
  }

  const imageUrl = getImageUrl(lembrete.foto_url);
  const hasLocation =
    lembrete.local_latitude != null && lembrete.local_longitude != null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditLembrete', { lembrete })
          }
        >
          <Ionicons name="pencil" size={22} color="#facc15" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.title,
                lembrete.prioridade > 0 && {
                  color: getPrioridadeColor(lembrete.prioridade),
                },
              ]}
            >
              {lembrete.titulo}
            </Text>
            {lembrete.prioridade > 0 && (
              <View
                style={[
                  styles.priorityPill,
                  { borderColor: getPrioridadeColor(lembrete.prioridade) },
                ]}
              >
                <Text
                  style={[
                    styles.priorityPillText,
                    { color: getPrioridadeColor(lembrete.prioridade) },
                  ]}
                >
                  {getPrioridadeLabel(lembrete.prioridade)}
                </Text>
              </View>
            )}
          </View>

          {lembrete.descricao ? (
            <Text style={styles.description}>{lembrete.descricao}</Text>
          ) : null}

          {imageUrl ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
          ) : null}

          <View style={styles.metaGrid}>
            {lembrete.data_hora ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Data</Text>
                <Text style={styles.metaValue}>
                  {new Date(lembrete.data_hora).toLocaleDateString()}
                </Text>
              </View>
            ) : null}
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Prioridade</Text>
              <Text
                style={[
                  styles.metaValue,
                  lembrete.prioridade > 0 && {
                    color: getPrioridadeColor(lembrete.prioridade),
                  },
                ]}
              >
                {lembrete.prioridade > 0
                  ? getPrioridadeLabel(lembrete.prioridade)
                  : 'Nenhuma'}
              </Text>
            </View>
            {lista?.nome ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Lista</Text>
                <Text style={styles.metaValue}>{lista.nome}</Text>
              </View>
            ) : null}
            {categoria?.nome ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Categoria</Text>
                <Text style={styles.metaValue}>{categoria.nome}</Text>
              </View>
            ) : null}
            {hasLocation ? (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Localizacao</Text>
                <Text style={styles.metaValue}>
                  {lembrete.local_latitude.toFixed(4)},{' '}
                  {lembrete.local_longitude.toFixed(4)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LembreteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  priorityPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: '#bbb',
    fontSize: 15,
    marginTop: 8,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    marginTop: 12,
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  metaGrid: {
    marginTop: 12,
    gap: 10,
  },
  metaItem: {
    backgroundColor: '#151515',
    borderRadius: 10,
    padding: 12,
  },
  metaLabel: {
    color: '#8a8a8a',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaValue: {
    color: '#f0f0f0',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyText: {
    color: '#fff',
    padding: 16,
    textAlign: 'center',
  },
});
