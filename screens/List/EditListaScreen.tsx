import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store/store';
import { updateLista } from '../../redux/actions/listaActions';
import { RootState } from '../../redux/reducers';

// Predefined color palette
const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

const EditListaScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const { listaId } = route.params || {};

  const lista = useSelector((s: RootState) =>
    s.listas.items.find((l) => String(l.id) === String(listaId))
  );

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [corHex, setCorHex] = useState('');

  useEffect(() => {
    if (lista) {
      setNome(lista.nome);
      setDescricao(lista.descricao || '');
      setCorHex(lista.cor_hex || '');
    }
  }, [lista]);

  const handleSubmit = () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da lista é obrigatório.');
      return;
    }
    if (!lista) {
      Alert.alert('Erro', 'Lista não encontrada.');
      return;
    }
    const updates = {
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      cor_hex: corHex.trim() || undefined,
    };
    dispatch(updateLista(String(lista.id), updates));
    navigation.goBack();
  };

  if (!lista) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Lista não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Editar Lista</Text>

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
      <View style={styles.colorPalette}>
        <FlatList
          data={COLOR_PALETTE}
          keyExtractor={(item) => item}
          numColumns={5}
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
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditListaScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#0b0b0b',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  label: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  colorPalette: { marginBottom: 16 },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: { borderColor: '#fff' },
  submitButton: { backgroundColor: '#6c2cff', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: { padding: 16, alignItems: 'center' },
  cancelText: { color: '#999', fontSize: 16 },
});
