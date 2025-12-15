import { Provider } from 'react-redux';
import { store } from './redux/store/store';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
