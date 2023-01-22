import { useNavigation } from '@react-navigation/native'
import { Text } from 'react-native'

export function HabitsListEmpty() {
  const { navigate } = useNavigation()

  return (
    <Text className="text-zinc-400 text-base">
      Você ainda não está monitorando nunhum hábito, comece {' '}

      <Text
        className="text-violet-400 text-base underline active:text-violet-500"
        onPress={() => navigate('new')}
      >
        cadastrando um.
      </Text>
    </Text>
  )
}