// screens/lists/EditListScreen.tsx
import React, { useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store/store';

import { RootState } from '../../redux/reducers';
import { updateLista, deleteLista } from '../../redux/actions/listaActions';

type RouteParams = {
  listaId: string;
};

const EditListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();

  const { listaId } = route.params as RouteParams;

  const lista = useSelector((s: RootState) =>
    s.listas.items.find((l) => String(l.id) === String(listaId))
  );

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    if (lista) {
      setNome(lista.nome);
      setDescricao(lista.descricao ?? '');
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

        {!lista.is_default && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>Eliminar Lista</Text>
          </TouchableOpacity>
        )}
      </View>
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

  deleteBtn: {
    marginTop: 32,
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
