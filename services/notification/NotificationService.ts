import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import { Lembrete } from '../../redux/types';

//Configuração Global (Como a notificação aparece com a app aberta)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {

  // --- PEDIR PERMISSÃO ---
  async registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (!Device.isDevice) { //Emuladores (pode não funcionar)
      console.log('Aviso: Notificações podem não funcionar corretamente em emuladores.');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permissão negada', 'Não será possível enviar lembretes!');
      return false;
    }

    return true;
  },

  // --- AGENDAR LEMBRETE ---
  async scheduleLembreteNotification(lembrete: Lembrete) {
    // Verificar se tem data e se notificações estão ativas
    if (!lembrete.notificar || !lembrete.data_hora) return;

    // Calcular a hora do trigger (Data Lembrete - Antecedência)
    const dataAlvo = new Date(lembrete.data_hora);
    const antecedenciaMs = (lembrete.antecedencia_minutos || 0) * 60 * 1000;
    const triggerDate = new Date(dataAlvo.getTime() - antecedenciaMs);

    // Se a data já passou, não agendar
    if (triggerDate.getTime() < Date.now()) return;

    console.log(`Agendando notificação para: ${triggerDate.toLocaleString()}`);

    const now = Date.now();
    const triggerTimestamp = triggerDate.getTime();
    let secondsUntilTrigger = Math.floor((triggerTimestamp - now) / 1000);

    if (secondsUntilTrigger <= 0) secondsUntilTrigger = 1; // Garante que é futuro

    try {
    //Agendar no OS
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ " + lembrete.titulo,
          body: lembrete.descricao || `Tens um lembrete para agora!`,
          data: { lembreteId: lembrete.id },
          sound: true, 
        },
        trigger: {
          // Usamos TIME_INTERVAL (segundos) que é mais estável no SDK 52
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilTrigger,
          repeats: false,
        }
      });

      return id; // Retorna o ID do agendamento 
    } catch (error) {
      console.error("Erro ao agendar notificação:", error);
    }
  },

  // --- C. CANCELAR NOTIFICAÇÃO (Para quando se apaga ou conclui um lembrete) ---
  // Nota: Para isto funcionar bem, precisarias de guardar o 'notification_id' na BD.
  // Como simplificação, podemos cancelar TUDO e reagendar, ou ignorar por agora.
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};