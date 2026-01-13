import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Alert } from 'react-native';
import { NotificationService } from '../notification/NotificationService'; 

// tarefa de background
export const GEOFENCING_TASK_NAME = 'GEOFENCING_TASK';

//DEFINIR A TAREFA 
TaskManager.defineTask(GEOFENCING_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error("Erro na tarefa de Geofencing:", error);
    return;
  }
  
  if (data.eventType === Location.GeofencingEventType.Enter) {
    const { region } = data; // A região onde o user entrou
    console.log("Entrou na região:", region.identifier);

    // Dispara uma notificação 
    await NotificationService.scheduleLembreteNotification({
      id: region.identifier,
      titulo: "Chegaste ao local! ",
      descricao: "Tens uma tarefa para fazer aqui.",
      notificar: true,
      data_hora: new Date().toISOString(), // Agora
      // ... outros campos fictícios para satisfazer o tipo ...
    } as any);
  }
});

export const LocationService = {
  async requestPermissions() {
    // Permissão Foreground (Enquanto usa a app)
    const { status: foreStatus } = await Location.requestForegroundPermissionsAsync();
    if (foreStatus !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à localização para os lembretes.');
      return false;
    }

    // Permissão Background 
    const { status: backStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backStatus !== 'granted') {
      Alert.alert(
        'Atenção', 
        'Para os lembretes de local funcionarem com a app fechada, tens de selecionar "Permitir Sempre" nas definições.'
      );
      return false;
    }
    return true;
  },

  // INICIAR MONITORIZAÇÃO (Chamar ao criar lembrete) 
  async startGeofencing(lembreteId: string, latitude: number, longitude: number, radius: number = 100) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    try {
      await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, [
        {
          identifier: lembreteId, // Usamos o ID do lembrete como identificador único
          latitude,
          longitude,
          radius, // em metros
          notifyOnEnter: true,
          notifyOnExit: false,
        },
      ]);
      console.log(`✅ Geofence criada para: ${lembreteId}`);
    } catch (error) {
      console.error("Erro ao criar Geofence:", error);
    }
  },

// PARAR MONITORIZAÇÃO 
  async stopGeofencing(lembreteId: string) {
    try {
      
      await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
      console.log(`Geofence parada (Tarefa: ${GEOFENCING_TASK_NAME})`);
    } catch (error) {
      console.log("Erro ao parar geofence (talvez não existisse):", error);
    }
  }
};