import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../redux/reducers';
import { apiAuth } from '../services/api';
import { LOGIN_SUCCESS, LOGOUT } from '../redux/types';

// --- SCREENS AUTH ---
import InitialScreen from '../screens/auth/InitialScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// --- SCREENS APP ---
import HomeScreen from '../screens/app/HomeScreen';
import CreateCategoriaScreen from '../screens/Categorias/CreateCategoriaScreen';
import CreateListaScreen from '../screens/List/CreateListaScreen';
import ListsOverviewScreen from '../screens/List/ListsOverviewScreen';
import ListDetailsScreen from '../screens/List/ListDetailsScreen';
import CreateLembreteScreen from '../screens/lembretes/CreateLembreteScreen';
import LembretesListScreen from '../screens/lembretes/LembretesListScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

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

  // Splash / loading inicial
  if (isCheckingSession) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // --- STACK APP ---
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreateLembrete" component={CreateLembreteScreen} />
            <Stack.Screen name="CreateCategoria" component={CreateCategoriaScreen} />
            <Stack.Screen name="CreateLista" component={CreateListaScreen} />
            <Stack.Screen name="ListsOverview" component={ListsOverviewScreen} />
            <Stack.Screen name="ListDetails" component={ListDetailsScreen} />
            <Stack.Screen name="LembretesList" component={LembretesListScreen} />
          </>
        ) : (
          // --- STACK AUTH ---
          <>
            <Stack.Screen name="Initial" component={InitialScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
