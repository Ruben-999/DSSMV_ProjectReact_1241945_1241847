// screens/lists/CreateListScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootState } from '../../redux/reducers';
import { useAppDispatch } from '../../redux/store/store';
import { addLista } from '../../redux/actions/listaActions';
import { updateLembrete } from '../../redux/actions/lembreteActions';

/* ───────────────────────────────────────────────
   Paleta de cores (alto contraste com branco/roxo/amarelo)
─────────────────────────────────────────────── */
const COLOR_PALETTE = [
  '#0f172a', // azul escuro
  '#064e3b', // verde escuro
  '#7c2d12', // castanho
  '#1e293b', // slate
  '#3f1d38', // vinho
  '#111827', // quase preto
];

const CreateListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const userId = useSelector(
    (s: RootState) => s.auth.user?.id
  );

  const lembretes = useSelector(
    (s: RootState) => s.lembretes.items
  );

  const lembretesSemLista = useMemo(
    () => lembretes.filter(l => !l.lista_id),
    [lembretes]
  );

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cor, setCor] = useState<string>(COLOR_PALETTE[0]);
  const [selectedLembretes, setSelectedLembretes] = useState<string[]>([]);

  const toggleLembrete = (id: string) => {
    setSelectedLembretes(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'A lista tem de ter um nome.');
      return;
    }

    if (!userId) {
      Alert.alert('Erro', 'Utilizador não autenticado.');
      return;
    }

    const action = await dispatch(
      addLista({
        user_id: userId,
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        cor_hex: cor,
      })
    );

    const listaCriadaId =
      (action as any)?.payload?.id;

    if (listaCriadaId && selectedLembretes.length > 0) {
      for (const id of selectedLembretes) {
        const lembrete = lembretes.find(l => l.id === id);
        if (!lembrete) continue;

        dispatch(
          updateLembrete(id, {
            ...lembrete,
            lista_id: listaCriadaId,
          })
        );
      }
    }

    navigation.goBack();
  };

  const renderLembrete = ({ item }: any) => {
    const selected = selectedLembretes.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.lembreteItem,
          selected && styles.lembreteSelected,
        ]}
        onPress={() => toggleLembrete(item.id)}
      >
        <Text style={styles.lembreteTitle}>{item.titulo}</Text>
        {selected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#22c55e"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Nova Lista</Text>

        <TouchableOpacity
          onPress={handleCreate}
          disabled={!nome.trim()}
        >
          <Text
            style={[
              styles.create,
              !nome.trim() && styles.disabled,
            ]}
          >
            Criar
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={styles.content}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Compras, Trabalho..."
                placeholderTextColor="#666"
                value={nome}
                onChangeText={setNome}
                autoFocus
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Opcional"
                placeholderTextColor="#666"
                value={descricao}
                onChangeText={setDescricao}
                multiline
              />
            </View>

            {/* Cores */}
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

            {/* Lembretes */}
            <Text style={[styles.label, { marginTop: 24 }]}>
              Adicionar lembretes
            </Text>
          </View>
        }
        data={lembretesSemLista}
        keyExtractor={item => item.id}
        renderItem={renderLembrete}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Não existem lembretes sem lista
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default CreateListScreen;

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
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  cancel: {
    color: '#ff6b6b',
    fontSize: 16,
  },

  create: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '700',
  },

  disabled: {
    color: '#555',
  },

  content: {
    padding: 16,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    color: '#aaa',
    marginBottom: 8,
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

  lembreteSelected: {
    backgroundColor: '#0f2f24',
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
});
