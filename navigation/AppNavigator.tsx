import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/app/HomeScreen';
import CreateCategoriaScreen from '../screens/app/CreateCategoriaScreen';
import React from 'react';
import { View, Text } from 'react-native';
import CreateListaScreen from '../screens/app/CreateListaScreen';
import ListsOverviewScreen from '../screens/app/ListsOverviewScreen';
import ListDetailsScreen from '../screens/app/ListDetailsScreen';

// `CreateLembreteScreen` was missing from the workspace which caused Metro
// to fail resolving the module. Provide a small placeholder component so
// the navigator can build. Replace this with the real screen when available.
const CreateLembreteScreen: React.FC = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>CreateLembreteScreen (placeholder)</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="CreateLembrete"
          component={CreateLembreteScreen}
        />
        <Stack.Screen name="CreateCategoria" component={CreateCategoriaScreen} />
        <Stack.Screen name="CreateLista" component={CreateListaScreen} />
        <Stack.Screen name="ListsOverview" component={ListsOverviewScreen} />
        <Stack.Screen name="ListDetails" component={ListDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
