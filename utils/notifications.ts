import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'

// Configure how notifications are handled when the app is foregrounded
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'web') {
        return true
    }

    if (!Device.isDevice && Platform.OS !== 'ios' && Platform.OS !== 'android') {
        return false
    }


    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }

    if (finalStatus !== 'granted') {
        console.log('Native: Failed to get push token for push notification!')
        return false
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }

    return true
}

export async function sendCongratulationsNotification() {
    if (Platform.OS === 'web') {
        alert("🎉 Congratulations! You've finished all your tasks! Great job! 📝")
    } else {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🎉 Congratulations!",
                body: "You've finished all your tasks! Great job! 📝",
                sound: true,
                priority: Notifications.AndroidNotificationPriority.MAX,
            },
            trigger: null, // send immediately
        })
    }
}
