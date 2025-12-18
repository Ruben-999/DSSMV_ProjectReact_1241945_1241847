import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/actions/authActions';
import { RootState } from '../../redux/reducers';
import { addLembrete } from '../../redux/actions/lembreteActions';

const LoginScreen = ({ navigation }: any) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    // @ts-ignore
    await dispatch(loginUser(email, password));
    // Não precisamos de navegar manualmente. 
    // Se o login funcionar, o Redux atualiza 'isAuthenticated' para true 
    // e o AppNavigator troca automaticamente para a Home.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta!</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

       <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20}}>
        <Text style={{color: '#888'}}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center' }, // Verde para Login
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: 'red', marginBottom: 10, textAlign: 'center'}
});

export default LoginScreen;