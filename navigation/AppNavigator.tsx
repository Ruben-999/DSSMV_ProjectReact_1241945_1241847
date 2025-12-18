import React, { useEffect, useState } from 'react'; // Importar useState
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/reducers';
import { apiAuth } from '../services/api';
import { LOGIN_SUCCESS, LOGOUT } from '../redux/types';
import { ActivityIndicator, View } from 'react-native'; // Importar View e Loader

// Screens
import InitialScreen from '../screens/auth/InitialScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/app/HomeScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth); 
  const dispatch = useDispatch();
  
  // Novo estado local apenas para o arranque da app
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
        // Terminamos a verificação, independentemente do resultado
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, [dispatch]);

  // Se estivermos ainda a verificar a sessão inicial, mostramos um Loading
  // Mas não usamos o loading global do Redux aqui.
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
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
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