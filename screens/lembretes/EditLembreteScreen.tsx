import React, { useState, useEffect} from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Switch, 
  Platform, Modal, FlatList, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useDispatch } from 'react-redux';
import { addLembrete, deleteLembrete, updateLembrete } from '../../redux/actions/lembreteActions';
import { Lembrete, LembreteInput, Prioridade } from '../../redux/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const EditLembreteScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const SUPABASE_PROJECT_ID = 'qrcsmtgswmlpcyivsquu'; 
  const BUCKET_NAME = 'lembretes-fotos';

  const { lembrete } = route.params;

  // --- ESTADOS ---
  const [titulo, setTitulo] = useState(lembrete.titulo);
  const [descricao, setDescricao] = useState(lembrete.descricao || '');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  
  // Prioridade
  const [temPrioridade, setTemPrioridade] = useState(lembrete.prioridade > 0);
  const [prioridade, setPrioridade] = useState<number>(lembrete.prioridade || 1);
  
  // Data e Hora
  const [temPrazo, setTemPrazo] = useState(!!lembrete.data_hora);
  const [dataLimite, setDataLimite] = useState(lembrete.data_hora ? new Date(lembrete.data_hora) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState<'date' | 'time'>('date');

  // Notificações, Repetição e Antecedência
  const [temNotificacao, setTemNotificacao] = useState(lembrete.notificar);
  const [repeticao, setRepeticao] = useState<string>(lembrete.repeticao || 'nunca');
  const [antecedencia, setAntecedencia] = useState<number>(lembrete.antecedencia_minutos || 0);

  // Localização e Imagem
  const [localizacao, setLocalizacao] = useState<string | null>(null); // Podes ignorar este se usares só o mapa
  const [pickedLocation, setPickedLocation] = useState<{lat: number, lng: number} | null>(
    lembrete.local_latitude ? { lat: lembrete.local_latitude, lng: lembrete.local_longitude } : null
  );
  const [temLocalizacao, setTemLocalizacao] = useState(!!lembrete.local_latitude);
  const [enderecoLegivel, setEnderecoLegivel] = useState<string | null>(null);
  const [imagemUri, setImagemUri] = useState<string | null>(lembrete.foto_url);

  // UI Control
  const [showDetails, setShowDetails] = useState(false);
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [modalCatVisible, setModalCatVisible] = useState(false);
  const [modalRepeticaoVisible, setModalRepeticaoVisible] = useState(false);
  const [modalAntecedenciaVisible, setModalAntecedenciaVisible] = useState(false); // <--- NOVO

  // Redux
  const dispatch = useDispatch()
  const listas = useSelector((state: RootState) => state.listas.items);
  const categorias = useSelector((state: RootState) => state.categorias.items);
  
  const nomeListaSelecionada = listas.find(l => l.id === selectedListId)?.nome;
  const nomeCatSelecionada = categorias.find(c => c.id === selectedCatId)?.nome;

  // Opções de Antecedência
  const antecedenciaOptions = [
      { id: '0', nome: 'Na hora do evento' },
      { id: '5', nome: '5 minutos antes' },
      { id: '15', nome: '15 minutos antes' },
      { id: '30', nome: '30 minutos antes' },
      { id: '60', nome: '1 hora antes' },
      { id: '1440', nome: '1 dia antes' },
  ];

  // Helper para mostrar o texto bonito
  const getAntecedenciaLabel = () => {
      const option = antecedenciaOptions.find(o => o.id === antecedencia.toString());
      return option ? option.nome : `${antecedencia} min antes`;
  };

  // Limpeza de estados em cascata
  useEffect(() => {
    if (!temPrazo) {
        setTemNotificacao(false);
        setRepeticao('nunca');
        setAntecedencia(0);
    }
  }, [temPrazo]);

  useEffect(() => {
    if (!temNotificacao) {
        setRepeticao('nunca');
        setAntecedencia(0);
    }
  }, [temNotificacao]);

// Carregar a morada legível ao abrir o ecrã
  useEffect(() => {
    const loadAddress = async () => {
      if (pickedLocation) {
        try {
          const moradas = await Location.reverseGeocodeAsync({
            latitude: pickedLocation.lat,
            longitude: pickedLocation.lng
          });

          if (moradas.length > 0) {
            const m = moradas[0];
            const texto = `${m.street || m.name || ''}, ${m.city || m.region || ''}`;
            setEnderecoLegivel(texto);
          }
        } catch (e) {
          setEnderecoLegivel("Localização (Morada não disponível)");
        }
      }
    };

    loadAddress();
    
  }, []); 

  // --- FUNÇÕES ---

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dataLimite;
    setShowDatePicker(Platform.OS === 'ios');
    setDataLimite(currentDate);

    if (Platform.OS === 'android') {
        setShowDatePicker(false);
        if (mode === 'date') {
            setMode('time');
            setShowDatePicker(true);
        }
    }
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShowDatePicker(true);
    setMode(currentMode);
  };

  const handleSelectImage = () => {
    Alert.alert("Anexar Foto", "Escolha a origem da imagem", [
        { text: "Cancelar", style: "cancel" },
        { text: "Câmara", onPress: openCamera },
        { text: "Galeria", onPress: openGallery },
    ]);
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Precisamos de permissão para aceder à galeria.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //metodo antigo mas o único que o TS reconhece
      allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) setImagemUri(result.assets[0].uri);
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Precisamos de permissão para usar a câmara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [4, 3], quality: 0.5,
    });
    if (!result.canceled) setImagemUri(result.assets[0].uri);
  };

  // Função para decidir o que mostrar na imagem
const getImageSource = () => {
  if (!imagemUri) return null;

  // 1. Se for uma nova foto tirada agora (começa por file://)
  if (imagemUri.startsWith('file://')) {
    return { uri: imagemUri };
  }

  // 2. Se for uma foto antiga do Supabase (caminho relativo)
  // Nota: Verifica se já não é um URL completo por segurança
  if (imagemUri.startsWith('http')) {
    return { uri: imagemUri };
  }

  // 3. Constrói o URL público
  return { 
    uri: `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${imagemUri}` 
  };
};

  // --- SUBMETER ---

    const handleSave = async () => {

        let lat = null;
        let long = null;
    
        // Prioridade: Se escolheu no mapa (pickedLocation), usa isso.
        // Se não, tenta fazer parse do texto manual (como tinhas antes).
        if (temLocalizacao && pickedLocation) {
            lat = pickedLocation.lat;
            long = pickedLocation.lng;
        } else if (localizacao) {
            const parts = localizacao.split(',');
            if (parts.length === 2) {
                lat = parseFloat(parts[0].trim());
                long = parseFloat(parts[1].trim());
            }
        }
    
        // Montar objeto compatível com a interface 'Lembrete'
        const updates = {
        titulo,
        descricao: descricao || null, // Se vazio envia null
        
        // IDs (Convertendo para number se a tua BD for BIGINT/Serial, 
        // ou manter string se for UUID. Assumindo number pelo teu type)
        lista_id: selectedListId ? parseInt(selectedListId) : null,
        categoria_id: selectedCatId ? parseInt(selectedCatId) : null,
        
        // Data
        data_hora: temPrazo ? dataLimite.toISOString() : null, // BD: data_hora
        
        // Prioridade (Assumindo que o type Prioridade aceita numeros 0-3)
        prioridade: (temPrioridade ? prioridade : 0) as Prioridade, 
        
        // Foto (Enviamos o URI local, o Service trata do upload e renomeia para foto_url)
        foto_url: imagemUri, 
        
        // Notificações
        notificar: temNotificacao, // BD: notificar
        repeticao: repeticao === 'nunca' ? null : repeticao, // Envia null se for 'nunca'
        antecedencia_minutos: temNotificacao ? antecedencia : 0,
        
        // Localização
        local_latitude: lat,
        local_longitude: long,
        raio_metros: 100, // Valor default, já que ainda não tens slider de raio
        
        concluido: false
    };

    console.log("Payload:", updates);
    
    await dispatch(updateLembrete(lembrete.id, updates) as any);
    navigation.goBack();
  };


  const handleDelete = () => {
    Alert.alert(
        "Eliminar Lembrete",
        "Tens a certeza? Esta ação não pode ser desfeita.",
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Eliminar", 
                style: "destructive",
                onPress: async () => {
                    await dispatch(deleteLembrete(lembrete.id) as any);
                    navigation.goBack();
                }
            } 
        ]
    );
};


  // --- RENDER MODAL ---
  const renderSelectionModal = (
    visible: boolean, items: any[], onClose: () => void, onSelect: (id: string) => void, title: string, emptyText: string
  ) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#fff" /></TouchableOpacity>
                </View>
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>{emptyText}</Text>}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.modalItem} onPress={() => { onSelect(item.id); onClose(); }}>
                            {item.cor_hex && <View style={[styles.colorDot, { backgroundColor: item.cor_hex }]} />}
                            <Text style={styles.modalItemText}>{item.nome}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#585858ff" />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Lembrete</Text>
        <TouchableOpacity onPress={handleSave} disabled={!titulo}>
          <Text style={[styles.createText, !titulo && styles.disabledText]}>Criar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.inputGroup}>
          <TextInput style={styles.titleInput} placeholder="O que precisas fazer?" placeholderTextColor="#636363ff" value={titulo} onChangeText={setTitulo} autoFocus />
          <TextInput style={styles.descInput} placeholder="Descrição / Notas" placeholderTextColor="#5b5b5bff" value={descricao} onChangeText={setDescricao} multiline />
        </View>

        <View style={styles.selectorsRow}>
            <TouchableOpacity style={styles.selectorButton} onPress={() => setModalListaVisible(true)}>
                <Ionicons name="list" size={20} color="#6c2cff" />
                <Text style={styles.selectorText} numberOfLines={1}>{nomeListaSelecionada || "Sem Lista"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectorButton} onPress={() => setModalCatVisible(true)}>
                <Ionicons name="bookmark" size={20} color="#6c2cff" />
                <Text style={styles.selectorText} numberOfLines={1}>{nomeCatSelecionada || "Sem Categoria"}</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.moreOptionsButton} onPress={() => setShowDetails(!showDetails)}>
            <Text style={styles.moreOptionsText}>{showDetails ? "Menos Opções" : "Adicionar Data, Notificações, Local..."}</Text>
            <Ionicons name={showDetails ? "chevron-up" : "chevron-down"} size={20} color="#6c2cff" />
        </TouchableOpacity>

        {showDetails && (
            <View style={styles.advancedContainer}>
                
                {/* 1. DATA E HORA */}
                <View style={styles.optionBlock}>
                    <View style={styles.optionHeaderRow}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="calendar-outline" size={22} color="#fff" />
                            <Text style={styles.optionLabel}>Definir Prazo</Text>
                        </View>
                        <Switch value={temPrazo} onValueChange={setTemPrazo} trackColor={{false: '#333', true: '#6c2cff'}} />
                    </View>
                    
                    {temPrazo && (
                        <>
                            <View style={styles.dateTimeContainer}>
                                <TouchableOpacity onPress={() => showMode('date')} style={styles.dateBtn}>
                                    <Text style={styles.dateText}>{dataLimite.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => showMode('time')} style={styles.dateBtn}>
                                    <Text style={styles.dateText}>{dataLimite.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* --- NOTIFICAÇÕES --- */}
                            <View style={styles.subOptionRow}>
                                <View style={styles.iconLabel}>
                                    <Ionicons name="notifications-outline" size={20} color="#ddd" />
                                    <Text style={styles.subOptionLabel}>Receber Notificação</Text>
                                </View>
                                <Switch value={temNotificacao} onValueChange={setTemNotificacao} trackColor={{false: '#333', true: '#6c2cff'}} />
                            </View>

                            {/* --- REPETIÇÃO E ANTECEDÊNCIA (Só se tiver Notificação) --- */}
                            {temNotificacao && (
                                <>
                                    {/* Repetição */}
                                    <TouchableOpacity style={styles.subOptionRow} onPress={() => setModalRepeticaoVisible(true)}>
                                        <View style={styles.iconLabel}>
                                            <Ionicons name="repeat-outline" size={20} color="#ddd" />
                                            <Text style={styles.subOptionLabel}>Repetir</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.valueText}>{repeticao === 'nunca' ? 'Nunca' : repeticao}</Text>
                                            <Ionicons name="chevron-forward" size={16} color="#666" style={{marginLeft: 5}}/>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Antecedência (NOVO) */}
                                    <TouchableOpacity style={styles.subOptionRow} onPress={() => setModalAntecedenciaVisible(true)}>
                                        <View style={styles.iconLabel}>
                                            <Ionicons name="alarm-outline" size={20} color="#ddd" />
                                            <Text style={styles.subOptionLabel}>Lembrar-me</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={styles.valueText}>{getAntecedenciaLabel()}</Text>
                                            <Ionicons name="chevron-forward" size={16} color="#666" style={{marginLeft: 5}}/>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                        </>
                    )}

                    {showDatePicker && temPrazo && (
                        <DateTimePicker testID="dateTimePicker" value={dataLimite} mode={mode} is24Hour={true} display="default" onChange={onChangeDate} />
                    )}
                </View>

               {/* 2. LOCALIZAÇÃO */}
<View style={styles.optionBlock}>
    <View style={styles.optionHeaderRow}>
        <View style={styles.iconLabel}>
            <Ionicons name="location-outline" size={22} color="#fff" />
            <Text style={styles.optionLabel}>Localização</Text>
        </View>
        {/* Switch para ativar/desativar */}
        <Switch 
            value={temLocalizacao} 
            onValueChange={(val) => {
                setTemLocalizacao(val);
                if (!val) setPickedLocation(null); // Se desligar, limpa os dados
            }} 
            trackColor={{false: '#333', true: '#6c2cff'}} 
        />
    </View>

    {/* Só mostra o botão do mapa se o Switch estiver ON */}
    {temLocalizacao && (
        <TouchableOpacity 
            style={{ 
            flexDirection: 'row', alignItems: 'center', marginTop: 10, 
            backgroundColor: '#2a2a2a', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#444'
            }}
onPress={() => {
        (navigation as any).navigate('LocationPicker', {
            onReturn: async (novaLocalizacao: {lat: number, lng: number}) => {
                // Guarda as coordenadas (para a lógica)
                setPickedLocation(novaLocalizacao);
                setTemLocalizacao(true);

                // Tenta descobrir o nome da rua 
                try {
                    const moradas = await Location.reverseGeocodeAsync({
                        latitude: novaLocalizacao.lat,
                        longitude: novaLocalizacao.lng
                    });

                    if (moradas.length > 0) {
                        const m = moradas[0];
                        // Cria uma string tipo: "Rua do ISEP, Porto"
                        const texto = `${m.street || m.name || ''}, ${m.city || m.region || ''}`;
                        setEnderecoLegivel(texto);
                    }
                } catch (e) {
                    setEnderecoLegivel("Localização selecionada (Morada não disponível)");
                }
            }
        });
    }}
    >
            <Ionicons 
            name={pickedLocation ? "map" : "map-outline"} 
            size={20} 
            color={pickedLocation ? "#6c2cff" : "#aaa"} 
            style={{marginRight: 10}} 
            />
            <View>
                <Text style={{color: '#fff', fontWeight: '500'}}>
                    {pickedLocation ? 'Local Selecionado' : 'Selecionar no Mapa'}
                </Text>
                {pickedLocation && (
                        <Text style={{color: '#888', fontSize: 11, marginTop: 2, maxWidth: 250}} numberOfLines={2}>
                            {enderecoLegivel ? `📍 ${enderecoLegivel}` : `Lat: ${pickedLocation.lat.toFixed(4)}...`}
                        </Text>
                    )}
                </View>
            <View style={{flex:1, alignItems: 'flex-end'}}>
                <Ionicons name="chevron-forward" size={16} color="#717171ff"/>
            </View>
        </TouchableOpacity>
    )}
            </View>
                {/* 3. PRIORIDADE */}
                <View style={styles.optionBlock}>
                    <View style={styles.optionHeaderRow}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="flag-outline" size={22} color="#fff" />
                            <Text style={styles.optionLabel}>Prioridade</Text>
                        </View>
                        <Switch value={temPrioridade} onValueChange={setTemPrioridade} trackColor={{false: '#333', true: '#6c2cff'}} />
                    </View>
                    {temPrioridade && (
                        <View style={styles.priorityContainer}>
                            {[1, 2, 3].map((p) => (
                                <TouchableOpacity key={p} 
                                    style={[styles.priorityBtn, prioridade === p && styles.priorityBtnActive, { borderColor: p === 3 ? '#ff6b6b' : p === 2 ? '#fde047' : '#86efac' }]}
                                    onPress={() => setPrioridade(p)}
                                >
                                    <Text style={[styles.priorityText, prioridade === p && {color: '#000'}]}>{p === 3 ? 'Alta' : p === 2 ? 'Média' : 'Baixa'}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* 4. FOTO */}
                <View style={styles.optionBlock}>
                    <View style={styles.optionHeaderRow}>
                        <View style={styles.iconLabel}>
                            <Ionicons name="image-outline" size={22} color="#fff" />
                            <Text style={styles.optionLabel}>Anexar Foto</Text>
                        </View>
                        <TouchableOpacity onPress={handleSelectImage}>
                            <Text style={styles.addPhotoText}>{imagemUri ? "Alterar" : "Adicionar"}</Text>
                        </TouchableOpacity>
                    </View>
                    {imagemUri && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={getImageSource() as any} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImagemUri(null)}>
                                <Ionicons name="trash" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </View>
        )}

        {/* BOTÃO ELIMINAR */}
        <TouchableOpacity 
            style={{
                marginTop: 30, backgroundColor: '#2a1a1a', 
                padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ff4444',
                alignItems: 'center'
            }}
            onPress={handleDelete}
        >
            <Text style={{color: '#ff6b6b', fontWeight: 'bold', fontSize: 16}}>
                <Ionicons name="trash-outline" size={18} /> Eliminar Lembrete
            </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAIS */}
      {renderSelectionModal(modalListaVisible, listas, () => setModalListaVisible(false), setSelectedListId, "Escolher Lista", "Nenhuma lista criada.")}
      {renderSelectionModal(modalCatVisible, categorias, () => setModalCatVisible(false), setSelectedCatId, "Escolher Categoria", "Nenhuma categoria criada.")}
      
      {/* MODAL REPETIÇÃO */}
      {renderSelectionModal(
          modalRepeticaoVisible, 
          [{id: 'nunca', nome: 'Nunca'}, {id: 'diario', nome: 'Diariamente'}, {id: 'semanal', nome: 'Semanalmente'}, {id: 'mensal', nome: 'Mensalmente'}, {id: 'anual', nome: 'Anualmente'}], 
          () => setModalRepeticaoVisible(false), (id) => setRepeticao(id), "Repetir Lembrete", ""
      )}

      {/* MODAL ANTECEDÊNCIA */}
      {renderSelectionModal(
          modalAntecedenciaVisible, 
          antecedenciaOptions, 
          () => setModalAntecedenciaVisible(false), 
          (id) => setAntecedencia(parseInt(id)), 
          "Lembrar-me", 
          ""
      )}

    </SafeAreaView>
  );
};

export default EditLembreteScreen;

// MANTÉM OS ESTILOS IGUAIS AO ANTERIOR
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelText: { color: '#ff6b6b', fontSize: 16 },
  createText: { color: '#6c2cff', fontSize: 16, fontWeight: 'bold' },
  disabledText: { color: '#555' },
  content: { padding: 16, paddingBottom: 50 },
  inputGroup: { marginBottom: 20 },
  titleInput: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  descInput: { fontSize: 16, color: '#ccc', minHeight: 60, textAlignVertical: 'top' },
  selectorsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  selectorButton: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', padding: 12, borderRadius: 8, gap: 8 },
  selectorText: { color: '#ddd', fontSize: 14, flex: 1 },
  moreOptionsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#222', marginBottom: 20 },
  moreOptionsText: { color: '#6c2cff', fontSize: 16, fontWeight: '600' },
  advancedContainer: { gap: 15 },
  optionBlock: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10 },
  optionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subOptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#333' },
  iconLabel: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionLabel: { color: '#fff', fontSize: 16 },
  subOptionLabel: { color: '#ddd', fontSize: 14 },
  valueText: { color: '#888', fontSize: 14 },
  dateTimeContainer: { flexDirection: 'row', marginTop: 15, gap: 10 },
  dateBtn: { backgroundColor: '#333', padding: 10, borderRadius: 6, flex: 1, alignItems: 'center' },
  dateText: { color: '#fff' },
  priorityContainer: { flexDirection: 'row', marginTop: 15, gap: 10 },
  priorityBtn: { flex: 1, padding: 8, borderRadius: 6, borderWidth: 1, alignItems: 'center' },
  priorityBtnActive: { backgroundColor: '#fff' },
  priorityText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  addPhotoText: { color: '#6c2cff', fontWeight: 'bold' },
  imagePreviewContainer: { marginTop: 15, alignItems: 'center', position: 'relative' },
  imagePreview: { width: '100%', height: 200, borderRadius: 8, resizeMode: 'cover' },
  removeImageBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1e1e1e', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  modalItemText: { color: '#fff', fontSize: 16, marginLeft: 10, flex: 1 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  emptyText: { color: '#777', padding: 20, textAlign: 'center' }
});