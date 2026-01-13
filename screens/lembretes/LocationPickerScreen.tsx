import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text, Dimensions } from 'react-native';
// 1. IMPORTAR O CIRCLE
import MapView, { Marker, MapPressEvent, Region, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const LocationPickerScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Não é possível mostrar a tua localização atual.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.015, // Zoom mais próximo para ver bem o raio de 100m
          longitudeDelta: 0.0121,
        });
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter a localização.');
      }
    };

    getUserLocation();
  }, []);

  const handleSelectLocation = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ lat: latitude, lng: longitude });
  };

  
const handleSave = () => {
    if (!selectedLocation) return;
    
    // Verifica se existe a função de retorno que enviámos do CreateLembreteScreen
    if (route.params?.onReturn) {
        route.params.onReturn(selectedLocation);
    }
    
    // Volta para trás (fecha o mapa)
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      {!initialRegion ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6c2cff" />
          <Text style={{color: '#fff', marginTop: 10}}>A carregar mapa...</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleSelectLocation}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {selectedLocation && (
            <>
                <Marker
                title="Local do Lembrete"
                coordinate={{
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng,
                }}
                />
                {/* 2. ADICIONAR A CIRCUNFERÊNCIA (RAIO 100m) */}
                <Circle 
                    center={{
                        latitude: selectedLocation.lat,
                        longitude: selectedLocation.lng,
                    }}
                    radius={100} // 100 metros (igual ao backend)
                    strokeColor="rgba(108, 44, 255, 0.8)" // Contorno Roxo
                    fillColor="rgba(108, 44, 255, 0.2)"   // Preenchimento Roxo transparente
                />
            </>
          )}
        </MapView>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {selectedLocation && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
            <Text style={styles.confirmText}>Confirmar Localização</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
// ... (Styles mantêm-se iguais, só precisas do import ActivityIndicator se usares no loading)
import { ActivityIndicator } from 'react-native'; 
export default LocationPickerScreen;

// ...styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  backButton: {
    position: 'absolute', top: 50, left: 20, backgroundColor: '#fff', padding: 10, borderRadius: 20, zIndex: 10
  },
  footer: { position: 'absolute', bottom: 40, left: 20, right: 20, alignItems: 'center' },
  confirmButton: {
    backgroundColor: '#6c2cff', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 30, width: '100%', alignItems: 'center'
  },
  confirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});