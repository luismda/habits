import { useState } from 'react'
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications'
import colors from 'tailwindcss/colors'

import { api } from '../lib/axios'
import { BackButton } from '../components/BackButton'
import { Checkbox } from '../components/Checkbox'

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
]

export function New() {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  const toast = useToast()

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(state => state.filter(weekDay => {
        return weekDay !== weekDayIndex
      }))
    } else {
      setWeekDays(state => [...state, weekDayIndex])
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim()) {
        return toast.show('Informe o nome do hábito.', {
          type: 'danger'
        })
      }

      if (weekDays.length === 0) {
        return toast.show('Escolha pelo menos um dia da semana para esse hábito.', {
          type: 'danger'
        })
      }

      setIsLoading(true)

      await api.post('/habits', {
        title,
        weekDays
      })

      setTitle('')
      setWeekDays([])

      toast.show('Hábito criado com sucesso!', {
        type: 'success'
      })
    } catch (error) {
      console.log(error)

      toast.show('Não foi possível criar o novo hábito.', {
        type: 'danger'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual seu comprometimento?
        </Text>

        <TextInput 
          className="h-12 pl-4 rounded-lg mt-3 text-white bg-zinc-900 border-2 border-zinc-800 focus:border-violet-600"
          placeholder="ex.: Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          cursorColor={colors.white}
          value={title}
          onChangeText={setTitle}
        />

        <Text className="mt-4 mb-3 text-white font-semibold text-base">
          Qual a recorrência?
        </Text>

        {availableWeekDays.map((weekDay, index) => {
          return (
            <Checkbox 
              key={weekDay}
              title={weekDay}
              checked={weekDays.includes(index)}
              onPress={() => handleToggleWeekDay(index)}
            />
          )
        })}

        <TouchableOpacity
          activeOpacity={0.7}
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-lg mt-6"
          onPress={handleCreateNewHabit}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 100 }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Feather 
                name="check"
                size={20}
                color={colors.white}
              />

              <Text className="font-semibold text-base text-white ml-2">
                Confirmar
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}