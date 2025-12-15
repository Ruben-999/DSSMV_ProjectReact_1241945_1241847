import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateLembreteScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Lembrete</Text>
    </View>
  );
};

export default CreateLembreteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
