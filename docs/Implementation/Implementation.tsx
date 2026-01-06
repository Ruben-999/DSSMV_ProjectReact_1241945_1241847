// ====================================================================
// NOTA INTRODUTÓRIA
// ====================================================================
// Neste ficheiro são apresentados excertos de código relevantes da
// implementação do projeto, apresentados exclusivamente para fins de
// documentação e explicação técnica.
//
// Todos os excertos encontram-se comentados linha a linha com o objetivo
// de demonstrar o funcionamento das funcionalidades nucleares da app,
// bem como de algumas funcionalidades secundárias que, embora não sejam
// críticas, utilizam mecânicas diferentes e tecnicamente interessantes
// (por exemplo, padrões de navegação ou interações avançadas de UI).
//
// As funcionalidades apresentadas foram selecionadas como exemplos
// representativos, uma vez que o mesmo padrão de implementação é
// reutilizado de forma consistente noutras partes da aplicação
// (nomeadamente para lembretes, categorias e listas).
//
// NOTA IMPORTANTE:
// Para visualizar o código no seu estado original, com realce de sintaxe
// (syntax highlighting), basta remover os comentários explicativos
// adicionados neste ficheiro. O código apresentado corresponde
// diretamente à implementação real da aplicação. É recomendado pedir a um LLM
// que remova os comentários para facilitar a leitura do código.
// ====================================================================


// ====================================================================
// ÍNDICE DE FUNCIONALIDADES
// ====================================================================
// 1. Gestão da Categoria Ativa (L50–L140)
//    - Estado global com Redux
//    - Persistência local com AsyncStorage
//    - Filtragem global de lembretes
//
// 2. Criação e Persistência de Dados – Exemplo: Lembretes (L150–L260)
//    - Comunicação UI → Redux → API → Base de Dados
//    - Sincronização do estado global
//    - Padrão reutilizado para categorias e listas
//
// 3. Navegação entre Ecrãs a partir de Interações de UI (L270–L350)
//    - Navegação por botão (React Navigation)
//    - Reutilização do mesmo padrão em toda a app
//
// 4. Interação por Long Press em Listas (L360–L470)
//    - Ativação de modos contextuais
//    - Separação entre navegação e ações destrutivas
// ====================================================================


// ====================================================================
// Functionality 1 – Active Category Management
// ====================================================================

// (Excerpt from redux/types/index.ts)
// export const SET_CATEGORIA_ATIVA = 'SET_CATEGORIA_ATIVA';

// (Excerpt from redux/actions/categoriaActions.ts)
// export const setCategoriaAtiva = (id: string) => async (dispatch: Dispatch) => {
//   await AsyncStorage.setItem(STORAGE_KEY, id);
//   dispatch({ type: SET_CATEGORIA_ATIVA, payload: id });
// };

// (Excerpt from redux/actions/categoriaActions.ts)
// export const loadCategoriaAtiva = () => async (dispatch: Dispatch) => {
//   const stored = await AsyncStorage.getItem(STORAGE_KEY);
//   if (stored) {
//     dispatch({ type: SET_CATEGORIA_ATIVA, payload: stored });
//   }
// };

// (Excerpt from redux/reducers/categoriaReducer.ts)
// const initialState: CategoriaState = {
//   items: [TODOS_CATEGORIA],
//   categoriaAtivaId: ID_TODOS,
//   loading: false,
//   error: null,
// };

// (Excerpt from redux/reducers/categoriaReducer.ts)
// case SET_CATEGORIA_ATIVA:
//   return {
//     ...state,
//     categoriaAtivaId: action.payload,
//   };

// (Excerpt from screens/app/HomeScreen.tsx)
// const categoriaAtivaId = useSelector(
//   (state: RootState) => state.categorias.categoriaAtivaId
// );

// (Excerpt from screens/app/HomeScreen.tsx)
// const lembretesFiltrados = useMemo(() => {
//   if (!categoriaAtivaId || String(categoriaAtivaId) === ID_TODOS) {
//     return lembretes;
//   }
//   return lembretes.filter(
//     (l: any) => String(l.categoria_id) === String(categoriaAtivaId)
//   );
// }, [lembretes, categoriaAtivaId]);

// ====================================================================
// End of Active Category Management
// ====================================================================


// ====================================================================
// Functionality 2 – Data Creation and Persistence (Example: Reminders)
// ====================================================================

// (Excerpt from redux/types/index.ts)
// export const CREATE_LEMBRETE_REQUEST = 'CREATE_LEMBRETE_REQUEST';
// export const CREATE_LEMBRETE_SUCCESS = 'CREATE_LEMBRETE_SUCCESS';
// export const CREATE_LEMBRETE_FAILURE = 'CREATE_LEMBRETE_FAILURE';

// (Excerpt from redux/actions/lembreteActions.ts)
// export const createLembrete = (data: any) => async (dispatch: Dispatch) => {
//   dispatch({ type: CREATE_LEMBRETE_REQUEST });
//   const response = await fetch(`${API_URL}/lembretes`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   const lembrete = await response.json();
//   dispatch({ type: CREATE_LEMBRETE_SUCCESS, payload: lembrete });
// };

// (Excerpt from redux/reducers/lembreteReducer.ts)
// const initialState: LembreteState = {
//   items: [],
//   loading: false,
//   error: null,
// };

// (Excerpt from redux/reducers/lembreteReducer.ts)
// case CREATE_LEMBRETE_REQUEST:
//   return {
//     ...state,
//     loading: true,
//   };

// case CREATE_LEMBRETE_SUCCESS:
//   return {
//     ...state,
//     items: [...state.items, action.payload],
//     loading: false,
//   };

// (Excerpt from screens/app/CreateLembreteScreen.tsx)
// dispatch(createLembrete({
//   title,
//   description,
//   categoria_id,
//   lista_id,
// }));

// ====================================================================
// End of Data Creation and Persistence
// ====================================================================


// ====================================================================
// Functionality 3 – Screen Navigation via Button Interaction
// ====================================================================

// (Excerpt from navigation/AppNavigator.tsx)
// const Stack = createNativeStackNavigator();

// <Stack.Navigator initialRouteName="InitialScreen">
//   <Stack.Screen name="InitialScreen" component={InitialScreen} />
//   <Stack.Screen name="HomeScreen" component={HomeScreen} />
//   <Stack.Screen name="CreateLembreteScreen" component={CreateLembreteScreen} />
// </Stack.Navigator>

// (Excerpt from screens/app/HomeScreen.tsx)
// const navigation = useNavigation();

// const handleCreateReminder = () => {
//   navigation.navigate('CreateLembreteScreen');
// };

// <Button
//   title="Create Reminder"
//   onPress={handleCreateReminder}
// />

// (Excerpt from screens/app/CreateLembreteScreen.tsx)
// const handleSuccess = () => {
//   navigation.goBack();
// };

// ====================================================================
// End of Screen Navigation via Button Interaction
// ====================================================================


// ====================================================================
// Functionality 4 – Long Press Interaction on Lists (Delete Mode)
// ====================================================================

// (Excerpt from screens/app/ListsOverviewScreen.tsx)
// const [deleteMode, setDeleteMode] = useState(false);
// const [selectedListId, setSelectedListId] = useState<string | null>(null);

// (Excerpt from components/ListItem.tsx)
// <TouchableOpacity
//   onPress={() => {
//     if (deleteMode) {
//       setSelectedListId(lista.id);
//     } else {
//       navigation.navigate('ListDetailsScreen', { listId: lista.id });
//     }
//   }}
//   onLongPress={() => {
//     setDeleteMode(true);
//     setSelectedListId(lista.id);
//   }}
// >
//   <Text>{lista.nome}</Text>
// </TouchableOpacity>

// (Excerpt from screens/app/ListsOverviewScreen.tsx)
// const handleConfirmDelete = () => {
//   if (selectedListId) {
//     dispatch(deleteLista(selectedListId));
//     setDeleteMode(false);
//     setSelectedListId(null);
//   }
// };

// <ConfirmationModal
//   visible={deleteMode}
//   onConfirm={handleConfirmDelete}
//   onCancel={() => setDeleteMode(false)}
// />

// ====================================================================
// End of Long Press Interaction on Lists
// ====================================================================
