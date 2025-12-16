import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Presentational CreateLista screen. Replace with a full form later.
const CreateListaScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Lista</Text>
      <Text style={styles.note}>(UI placeholder — add form here)</Text>

      <TouchableOpacity style={styles.close} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateListaScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  note: { color: '#666', marginBottom: 20 },
  close: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#6c2cff', borderRadius: 8 },
  closeText: { color: '#fff', fontWeight: '600' },
});
