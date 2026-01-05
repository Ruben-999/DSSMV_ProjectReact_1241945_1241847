// screens/lists/EditListScreen.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { RootState } from '../../redux/reducers';
import { useAppDispatch } from '../../redux/store/store';
import { updateLista, deleteLista } from '../../redux/actions/listaActions';
import { updateLembrete } from '../../redux/actions/lembreteActions';

type RouteParams = {
  listaId: string;
};

/* ───────────────────────────────────────────────
   Paleta de cores (igual à criação)
─────────────────────────────────────────────── */
const COLOR_PALETTE = [
  '#0f172a',
  '#064e3b',
  '#7c2d12',
  '#1e293b',
  '#3f1d38',
  '#111827',
];

const EditListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();

  const { listaId } = route.params as RouteParams;

  const lista = useSelector((s: RootState) =>
    s.listas.items.find(l => String(l.id) === String(listaId))
  );

  const lembretes = useSelector(
    (s: RootState) => s.lembretes.items
  );

  const lembretesDaLista = useMemo(
    () => lembretes.filter(l => String(l.lista_id) === String(listaId)),
    [lembretes, listaId]
  );

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState<string>(COLOR_PALETTE[0]);

  useEffect(() => {
    if (lista) {
      setNome(lista.nome);
      setDescricao(lista.descricao ?? '');
      if (lista.cor_hex) {
        setCor(lista.cor_hex);
      }
    }
  }, [lista]);

  if (!lista) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Lista não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const handleSave = () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da lista é obrigatório.');
      return;
    }

    dispatch(
      updateLista(String(lista.id), {
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        cor_hex: cor,
      })
    );

    navigation.goBack();
  };

  const handleDelete = () => {
    if (lista.is_default) {
      Alert.alert(
        'Lista protegida',
        'A lista default não pode ser eliminada.'
      );
      return;
    }

    Alert.alert(
      'Eliminar lista',
      'Tens a certeza? Os lembretes não serão apagados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteLista(String(lista.id)));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRemoveLembrete = (lembrete: any) => {
    Alert.alert(
      'Remover lembrete',
      'Remover este lembrete da lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            dispatch(
              updateLembrete(lembrete.id, {
                ...lembrete,
                lista_id: null,
              })
            );
          },
        },
      ]
    );
  };

  const renderLembrete = ({ item }: any) => (
    <View style={styles.lembreteItem}>
      <Text style={styles.lembreteTitle}>{item.titulo}</Text>
      <TouchableOpacity onPress={() => handleRemoveLembrete(item)}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Editar Lista</Text>

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <FlatList
        ListHeaderComponent={
          <View style={styles.content}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome da lista"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Opcional"
              placeholderTextColor="#666"
              multiline
            />

            {/* CORES */}
            <Text style={styles.label}>Cor da Lista</Text>
            <View style={styles.palette}>
              {COLOR_PALETTE.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c },
                    cor === c && styles.colorSelected,
                  ]}
                  onPress={() => setCor(c)}
                />
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lembretes</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddLembreteToLista', {
                    listaId: lista.id,
                  })
                }
              >
                <Ionicons name="add-circle" size={26} color="#22c55e" />
              </TouchableOpacity>
            </View>
          </View>
        }
        data={lembretesDaLista}
        keyExtractor={item => item.id}
        renderItem={renderLembrete}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum lembrete nesta lista
          </Text>
        }
        ListFooterComponent={
          !lista.is_default ? (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
            >
              <Text style={styles.deleteText}>Eliminar Lista</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default EditListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },

  error: {
    color: '#fff',
    padding: 16,
    fontSize: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  cancel: {
    color: '#aaa',
    fontSize: 16,
  },

  save: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '700',
  },

  content: {
    padding: 16,
  },

  label: {
    color: '#aaa',
    marginBottom: 6,
    marginTop: 12,
    fontSize: 14,
  },

  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  palette: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
  },

  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },

  colorSelected: {
    borderWidth: 2,
    borderColor: '#22c55e',
  },

  sectionHeader: {
    marginTop: 24,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  lembreteItem: {
    backgroundColor: '#1e1e1e',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  lembreteTitle: {
    color: '#fff',
    fontSize: 15,
  },

  empty: {
    color: '#777',
    textAlign: 'center',
    marginTop: 12,
  },

  deleteBtn: {
    margin: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#7f1d1d',
    alignItems: 'center',
  },

  deleteText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
