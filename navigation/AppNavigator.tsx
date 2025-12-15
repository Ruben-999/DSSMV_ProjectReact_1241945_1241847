import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/app/HomeScreen';
import CreateLembreteScreen from '../screens/app/CreateLembreteScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
