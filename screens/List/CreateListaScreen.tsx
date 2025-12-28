import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store/store';
import { addLista } from '../../redux/actions/listaActions';
import { RootState } from '../../redux/reducers';

// Predefined color palette
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#5DADE2', '#D7BDE2',
];

const CreateListaScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [corHex, setCorHex] = useState('');

  const handleSubmit = () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da lista é obrigatório.');
      return;
    }

    if (!user?.id) {
      Alert.alert('Erro', 'Utilizador não autenticado.');
      return;
    }

    const listaData = {
      user_id: user.id,
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      cor_hex: corHex || null,
      is_default: false,
    };
  
    
    // 👉 criação delegada ao Redux (única fonte de verdade)
    dispatch(addLista(listaData));

    // 👉 o Overview reage ao Redux, não a params
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={COLOR_PALETTE}
        keyExtractor={(item) => item}
        numColumns={5}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Criar Lista</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da lista"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={setDescricao}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Cor da Lista (opcional)</Text>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.colorOption,
              { backgroundColor: item },
              corHex === item && styles.selectedColor,
            ]}
            onPress={() => setCorHex(item)}
            accessibilityLabel={`Selecionar cor ${item}`}
          />
        )}
        ListFooterComponent={
          <>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Criar Lista</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  content: { padding: 16, paddingBottom: 40 },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#0b0b0b',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },

  textArea: { height: 80, textAlignVertical: 'top' },

  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedColor: { borderColor: '#fff' },

  submitButton: {
    backgroundColor: '#6c2cff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },

  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  cancelButton: { padding: 16, alignItems: 'center' },

  cancelText: { color: '#999', fontSize: 16 },
});


export default CreateListaScreen;
