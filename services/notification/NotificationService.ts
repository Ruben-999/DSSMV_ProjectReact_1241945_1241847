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
    if (!lembrete.repeticao && triggerDate.getTime() < Date.now()) return;

    console.log(`Agendando notificação para (${lembrete.repeticao || 'único'}): ${triggerDate.toLocaleString()}`);

    const content = {
      title: "⏰ " + lembrete.titulo,
      body: lembrete.descricao || `Tens um lembrete agora!`,
      data: { lembreteId: lembrete.id },
      sound: true,
    };

try {
      let trigger: any;

      // Lógica de Repetição (Usamos CALENDAR - por causa do controlo por dias/meses etc...)
      switch (lembrete.repeticao) {
        case 'diario':
          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: true, 
          };
          break;

        case 'semanal':
          // No Expo/JS o Domingo é 1, Segunda é 2, etc. (1-7)
          // O getDay() (Dia da Semana) do TS devolve 0 (Domingo) a 6 (Sábado).
          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            weekday: triggerDate.getDay() + 1, // JS (0-6) -> Expo Calendar (1-7)
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: true,
          };
          break;

        case 'mensal':

          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            day: triggerDate.getDate(), // getDate() = Dia do Mes (1 - 31)
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: true,
          };
          break;

        case 'anual':

          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            month: triggerDate.getMonth() + 1, // JS (0-11) --> Calendar (1-12)
            weekday: triggerDate.getDate(),
            hour: triggerDate.getHours(),
            minute: triggerDate.getMinutes(),
            repeats: true,
          }
          break;
        
        default:
          // Sem repetição - Trigger Único
          // Neste caso é melhor usar o TIME_INTERVAL
          const now = Date.now();
          const currentDateTime = triggerDate.getTime();
          let secondsUntilTrigger = Math.floor((currentDateTime - now) / 1000);

          if (secondsUntilTrigger <= 0) secondsUntilTrigger = 1; // Garante que é no futuro

          trigger = {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: secondsUntilTrigger,
            repeats: false,
          };
          break;
      }

      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger,
      });

      return id;
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