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
import CreateLembreteScreen from '../screens/lembretes/CreateLembreteScreen';
import LembretesListScreen from '../screens/lembretes/LembretesListScreen';

import CreateCategoriaScreen from '../screens/Categorias/CreateCategoriaScreen';
import EditCategoriaScreen from '../screens/Categorias/EditCategoriaScreen';

import ListsOverviewScreen from '../screens/List/ListsOverviewScreen';
import ListDetailsScreen from '../screens/List/ListDetailsScreen';
import CreateListaScreen from '../screens/List/CreateListaScreen';
import EditListScreen from '../screens/List/EditListaScreen';
import AddLembreteToLista from '../screens/List/AddLembreteToListaScreen';
import AddLembreteToListaScreen from '../screens/List/AddLembreteToListaScreen';

// ================= STACKS =================

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

// ================= AUTH STACK =================

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Initial" component={InitialScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// ================= APP STACK =================

const AppNavigatorStack = () => (
  <AppStack.Navigator screenOptions={{ headerShown: false }}>
    {/* ROOT */}
    <AppStack.Screen name="Home" component={HomeScreen} />

    {/* LEMBRETES */}
    <AppStack.Screen name="CreateLembrete" component={CreateLembreteScreen} />
    <AppStack.Screen name="LembretesList" component={LembretesListScreen} />

    {/* CATEGORIAS */}
    <AppStack.Screen name="CreateCategoria" component={CreateCategoriaScreen} />
    <AppStack.Screen name="EditCategoria" component={EditCategoriaScreen} />

    {/* LISTAS */}
    <AppStack.Screen name="ListsOverview" component={ListsOverviewScreen} />
    <AppStack.Screen name="ListDetails" component={ListDetailsScreen} />
    <AppStack.Screen name="CreateLista" component={CreateListaScreen} />
    <AppStack.Screen name="EditList" component={EditListScreen} />
    <AppStack.Screen name="AddLembreteToLista" component={AddLembreteToListaScreen} />
  </AppStack.Navigator>
);

// ================= ROOT NAVIGATOR =================

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

  if (isCheckingSession) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigatorStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
