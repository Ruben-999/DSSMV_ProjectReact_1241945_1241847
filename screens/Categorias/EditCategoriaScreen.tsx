import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { RootState } from '../../redux/reducers';
import { updateCategoria } from '../../redux/actions/categoriaActions';
import {
  updateLembrete,
  fetchLembretes,
} from '../../redux/actions/lembreteActions';

type RouteParams = {
  categoriaId: string;
};

const EditCategoriaScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();

  const { categoriaId } = route.params as RouteParams;

  // --- REDUX ---
  const categoria = useSelector((s: RootState) =>
    s.categorias.items.find(
      (c) => String(c.id) === String(categoriaId)
    )
  );

  const lembretes = useSelector((s: RootState) => s.lembretes.items);
  const userId = useSelector((s: RootState) => s.auth.user?.id);

  // --- STATE ---
  const [nome, setNome] = useState('');
  const [selectedLembreteIds, setSelectedLembreteIds] = useState<string[]>([]);

  // --- INIT ---
  useEffect(() => {
    if (categoria) {
      setNome(categoria.nome);
    }
  }, [categoria]);

  useEffect(() => {
    if (!categoria) return;

    const ids = lembretes
      .filter((l) => String(l.categoria_id) === String(categoria.id))
      .map((l) => String(l.id));

    setSelectedLembreteIds(ids);
  }, [categoria, lembretes]);

  // --- SAVE ---
  const handleSave = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da categoria é obrigatório.');
      return;
    }

    if (!categoria) {
      Alert.alert('Erro', 'Categoria não encontrada.');
      return;
    }

    // 1️⃣ Atualizar categoria
    await dispatch(
      updateCategoria(categoria.id, {
        nome: nome.trim(),
      }) as any
    );

    // 2️⃣ Diferenças nos lembretes
    const lembretesParaAdicionar = lembretes.filter(
      (l) =>
        selectedLembreteIds.includes(String(l.id)) &&
        String(l.categoria_id) !== String(categoria.id)
    );

    const lembretesParaRemover = lembretes.filter(
      (l) =>
        !selectedLembreteIds.includes(String(l.id)) &&
        String(l.categoria_id) === String(categoria.id)
    );

    // 3️⃣ Aplicar updates

    // ➕ adicionar à categoria
    for (const l of lembretesParaAdicionar) {
      await dispatch(
        updateLembrete(l.id, {
          categoria_id: Number(categoria.id),
        }) as any
      );
    }

    // ➖ remover da categoria
    for (const l of lembretesParaRemover) {
      await dispatch(
        updateLembrete(l.id, {
          categoria_id: null,
        }) as any
      );
    }

    // 4️⃣ Refresh e sair
    if (userId) {
      dispatch(fetchLembretes(userId) as any);
    }

    navigation.goBack();
  };

  if (!categoria) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Categoria não encontrada.</Text>
      </SafeAreaView>
    );
  }

  // --- UI ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancel}>Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Editar Categoria</Text>

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.save}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome da categoria"
          placeholderTextColor="#666"
        />

        <Text style={[styles.label, { marginTop: 24 }]}>
          Lembretes desta categoria
        </Text>

        {lembretes.map((l) => {
          const checked = selectedLembreteIds.includes(String(l.id));

          return (
            <TouchableOpacity
              key={l.id}
              style={styles.lembreteRow}
              onPress={() => {
                setSelectedLembreteIds((prev) =>
                  checked
                    ? prev.filter((id) => id !== String(l.id))
                    : [...prev, String(l.id)]
                );
              }}
            >
              <Text style={styles.lembreteText}>{l.titulo}</Text>
              <Ionicons
                name={checked ? 'checkbox' : 'square-outline'}
                size={22}
                color={checked ? '#22c55e' : '#777'}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditCategoriaScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  error: {
    color: '#fff',
    padding: 16,
    textAlign: 'center',
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
    fontWeight: '700',
    fontSize: 16,
  },

  cancel: {
    color: '#aaa',
    fontSize: 14,
  },

  save: {
    color: '#22c55e',
    fontWeight: '700',
    fontSize: 14,
  },

  content: {
    padding: 16,
  },

  label: {
    color: '#aaa',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },

  lembreteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },

  lembreteText: {
    color: '#fff',
    fontSize: 15,
  },
});
