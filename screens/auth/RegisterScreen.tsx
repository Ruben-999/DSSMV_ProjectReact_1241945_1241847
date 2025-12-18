import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { apiAuth } from '../../services/api'; // Importamos apenas a API

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);

  const handleRegister = async () => {
    // Validação básica
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoadingLocal(true);
    
    try {
       
       const { error } = await apiAuth.signUp(email, password, name);
       
       if (error) {
         Alert.alert('Erro no Registo', error);
       } else {
         Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login.', [
           { text: 'OK', onPress: () => navigation.navigate('Initial') }
         ]);
       }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro inesperado');
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Nome" 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loadingLocal}>
        {loadingLocal ? (
            <ActivityIndicator color="#fff"/> 
        ) : ( 
            <Text style={styles.buttonText}>Registar</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20}}>
        <Text style={{color: '#888'}}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default RegisterScreen;