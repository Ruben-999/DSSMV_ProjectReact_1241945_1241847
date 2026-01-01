import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../redux/reducers';
import { updateCategoria } from '../../redux/actions/categoriaActions';

type RouteParams = {
  categoriaId: string;
};

const EditCategoriaScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();

  const { categoriaId } = route.params as RouteParams;

  const categoria = useSelector((s: RootState) =>
    s.categorias.items.find(
      (c) => String(c.id) === String(categoriaId)
    )
  );

  const [nome, setNome] = useState('');

  useEffect(() => {
    if (categoria) {
      setNome(categoria.nome);
    }
  }, [categoria]);

  const handleSave = () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da categoria é obrigatório.');
      return;
    }

    if (!categoria) {
      Alert.alert('Erro', 'Categoria não encontrada.');
      return;
    }

    // ✅ AQUI ESTAVA O ERRO — agora está correto
    dispatch(
      updateCategoria(categoria.id, {
        nome: nome.trim(),
      }) as any
    );

    navigation.goBack();
  };

  if (!categoria) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Categoria não encontrada.</Text>
      </SafeAreaView>
    );
  }

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

      <View style={styles.content}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome da categoria"
          placeholderTextColor="#666"
        />
      </View>
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
});
