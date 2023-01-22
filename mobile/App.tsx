import './src/lib/dayjs'

import { StatusBar } from 'react-native'
import { ToastProvider } from 'react-native-toast-notifications'
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter'
import colors from 'tailwindcss/colors'

import { Routes } from './src/routes'

import { Loading } from './src/components/Loading'

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <ToastProvider 
      placement='top'
      offsetTop={40}
      textStyle={{ textAlign: 'center' }}
      successColor={colors.green[600]}
      dangerColor={colors.red[600]}
    >
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    </ToastProvider>
  )
}
