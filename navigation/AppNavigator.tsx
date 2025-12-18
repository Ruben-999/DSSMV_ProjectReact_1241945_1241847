import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/reducers';
import { apiAuth } from '../services/api';
import { LOGIN_SUCCESS, LOGOUT } from '../redux/types';

// --- SCREENS DE AUTH ---
import InitialScreen from '../screens/auth/InitialScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// --- SCREENS DA APP ---
import HomeScreen from '../screens/app/HomeScreen';
import CreateCategoriaScreen from '../screens/app/CreateCategoriaScreen';
import CreateListaScreen from '../screens/app/CreateListaScreen';
import ListsOverviewScreen from '../screens/app/ListsOverviewScreen';
import ListDetailsScreen from '../screens/app/ListDetailsScreen';

// Placeholder temporário para o CreateLembrete (para não dar erro de build)
const CreateLembreteScreen: React.FC = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>CreateLembreteScreen (placeholder)</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth); 
  const dispatch = useDispatch();
  
  // Estado local para o splash screen / verificação de sessão
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await apiAuth.getCurrentUser();
        if (user) {
          dispatch({ type: LOGIN_SUCCESS, payload: user });
        } else {
          dispatch({ type: LOGOUT });
        }
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, [dispatch]);

  // Loading inicial enquanto verifica o Supabase
  if (isCheckingSession) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    ); 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // --- STACK APP (User Logado) ---
          // Aqui juntamos o Home com todas as outras telas internas
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreateLembrete" component={CreateLembreteScreen} />
            <Stack.Screen name="CreateCategoria" component={CreateCategoriaScreen} />
            <Stack.Screen name="CreateLista" component={CreateListaScreen} />
            <Stack.Screen name="ListsOverview" component={ListsOverviewScreen} />
            <Stack.Screen name="ListDetails" component={ListDetailsScreen} />
          </Stack.Group>
        ) : (
          // --- STACK AUTH (User Não Logado) ---
          <Stack.Group>
            <Stack.Screen name="Initial" component={InitialScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};