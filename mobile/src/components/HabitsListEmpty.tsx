import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native'

export function HabitsListEmpty() {
  const { navigate } = useNavigation()

  return (
    <Text className="text-zinc-400 text-base text-center">
      Você ainda não está monitorando nunhum hábito, {' '}

      <Text
        className="text-violet-400 text-base underline active:text-violet-500"
        onPress={() => navigate('new')}
      >
        comece criando um
      </Text>
    </Text>
  )
}