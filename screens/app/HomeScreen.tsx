// src/screens/app/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/actions/authActions';
import { RootState } from '../../redux/reducers';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    // @ts-ignore
    dispatch(logoutUser());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Olá, {user?.nome || 'Utilizador'}!</Text>
      <Text style={styles.subText}>Estás na Home.</Text>
      
      <View style={{ marginTop: 20 }}>
        <Button title="Sair (Logout)" onPress={handleLogout} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 24, fontWeight: 'bold' },
  subText: { fontSize: 16, color: '#666', marginBottom: 20 },
});

export default HomeScreen;