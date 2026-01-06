// AddLembreteToLista.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../redux/reducers';
import { updateLembrete } from '../../redux/actions/lembreteActions';
import type { AppDispatch } from '../../redux/store/store';

const AddLembreteToLista = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const { listaId } = route.params;

  const lembretes = useSelector(
    (state: RootState) => state.lembretes.items
  );

  const lembretesSemLista = useMemo(
    () => lembretes.filter(l => !l.lista_id),
    [lembretes]
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('Seleciona pelo menos um lembrete');
      return;
    }

    try {
      for (const id of selectedIds) {
        const lembrete = lembretes.find(l => l.id === id);
        if (!lembrete) continue;

        await dispatch(
          updateLembrete(id, {
            ...lembrete,
            lista_id: listaId,
          })
        );
      }

      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao adicionar lembretes à lista');
    }
  };

  const renderItem = ({ item }: any) => {
    const selected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.item,
          selected && styles.itemSelected,
        ]}
        onPress={() => toggleSelect(item.id)}
      >
        <Text style={styles.title}>{item.titulo}</Text>
        {selected && (
          <Ionicons name="checkmark-circle" size={22} color="#2ecc71" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={lembretesSemLista}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Não existem lembretes sem lista
          </Text>
        }
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Adicionar à lista</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddLembreteToLista;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#121212',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: '#dff6ea',
  },
  title: {
    fontSize: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2ecc71',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
