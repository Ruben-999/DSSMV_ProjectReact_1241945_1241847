// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import { AppNavigator } from './navigation/AppNavigator'; // 
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
         <AppNavigator />  
      </SafeAreaProvider>
    </Provider>
  );
}
