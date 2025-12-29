// screens/categorias/CreateCategoriaScreen.tsx
import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../redux/reducers';
import { addCategoria } from '../../redux/actions/categoriaActions';

const CreateCategoriaScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const userId = useSelector(
    (state: RootState) => state.auth.user?.id
  );

  const [nome, setNome] = useState('');

  const handleCreate = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da categoria é obrigatório.');
      return;
    }

    if (!userId) {
      Alert.alert('Erro', 'Utilizador não autenticado.');
      return;
    }

    await dispatch(
      addCategoria({
        user_id: userId,
        nome: nome.trim(),
      }) as any
    );

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Nova Categoria</Text>

        <TouchableOpacity
          onPress={handleCreate}
          disabled={!nome.trim()}
        >
          <Text
            style={[
              styles.createText,
              !nome.trim() && styles.disabledText,
            ]}
          >
            Criar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.block}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Trabalho, Faculdade…"
            placeholderTextColor="#666"
            autoFocus
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateCategoriaScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelText: { color: '#aaa', fontSize: 14 },
  createText: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: '700',
  },
  disabledText: { color: '#555' },

  content: { padding: 16 },

  block: { marginBottom: 24 },
  label: { color: '#aaa', marginBottom: 6 },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
});
