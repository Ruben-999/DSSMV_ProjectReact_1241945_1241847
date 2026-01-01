// screens/lists/CreateListScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { RootState } from '../../redux/reducers';
import { useAppDispatch } from '../../redux/store/store';
import { addLista } from '../../redux/actions/listaActions';

const CreateListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const userId = useSelector(
    (s: RootState) => s.auth.user?.id
  );

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleCreate = () => {
    if (!nome.trim()) {
      Alert.alert(
        'Nome obrigatório',
        'A lista tem de ter um nome.'
      );
      return;
    }

    if (!userId) {
      Alert.alert('Erro', 'Utilizador não autenticado.');
      return;
    }

    dispatch(
      addLista({
        user_id: userId,
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        is_default: false,
      })
    );

    navigation.goBack();
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

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
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
      </ScrollView>
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
});
