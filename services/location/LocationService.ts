import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Alert } from 'react-native';
import { NotificationService } from '../notification/NotificationService'; 

// tarefa de background
export const GEOFENCING_TASK_NAME = 'GEOFENCING_TASK';

//DEFINIR A TAREFA 
try {
TaskManager.defineTask(GEOFENCING_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error("Erro na tarefa de Geofencing:", error.message);
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
} catch (e) {
  console.log("Aviso: Não foi possível definir a Task (Provavelmente limitações do Expo Go).");
}

export const LocationService = {
  
  async requestPermissions() {
    try {
        const { status: foreStatus } = await Location.requestForegroundPermissionsAsync();
        if (foreStatus !== 'granted') {
            return false;
        }

        const { status: backStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backStatus !== 'granted') {
            console.log("Permissão de background negada. Geofencing não funcionará app fechada.");
            return true; 
        }
        return true;
    } catch (e) {
        console.log("Erro ao pedir permissões:", e);
        return false;
    }
  },

  // INICIAR MONITORIZAÇÃO (Chamar ao criar lembrete) 
  async startGeofencing(lembreteId: string, latitude: number, longitude: number, radius: number = 100) {
    // Verificar se o TaskManager está disponível 
    const isTaskDefined = await TaskManager.isTaskDefined(GEOFENCING_TASK_NAME);
    if (!isTaskDefined) {
        console.log("Task de Geofencing não definida. Ignorando start.");
        return;
    }
    
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
      console.log(`Geofence criada para: ${lembreteId}`);
    } catch (error: any) {
      // Se o erro for sobre "Task not found" ou limitações do Expo Go, apenas avisamos na consola
      if (error.message && error.message.includes('Task')) {
          console.log(`Aviso Expo Go: Não foi possível iniciar Geofence real (Limitação do simulador/app): ${error.message}`);
      } else {
          console.error("Erro genérico ao criar Geofence:", error);
      }
    }
  },

// PARAR MONITORIZAÇÃO 
  async stopGeofencing(lembreteId: string) {
    try {
      const isTaskDefined = await TaskManager.isTaskDefined(GEOFENCING_TASK_NAME);
      if (!isTaskDefined) return;

      await Location.stopGeofencingAsync(GEOFENCING_TASK_NAME);
      console.log(`Geofence parada (Tarefa: ${GEOFENCING_TASK_NAME})`);
    } catch (error) {
      console.log("Erro ao parar geofence (talvez não existisse):", error);
    }
  }
};