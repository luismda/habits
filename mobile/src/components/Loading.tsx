import { ActivityIndicator, View } from 'react-native'
import colors from 'tailwindcss/colors'

export function Loading() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator color={colors.violet[600]} />
    </View>
  )
}