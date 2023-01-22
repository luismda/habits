import { useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
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
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

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
        return Alert.alert('Novo hábito', 'Informe o nome do hábito.')
      }

      if (weekDays.length === 0) {
        return Alert.alert('Novo hábito', 'Escolha pelo menos um dia da semana para esse hábito.')
      }

      await api.post('/habits', {
        title,
        weekDays
      })

      setTitle('')
      setWeekDays([])

      Alert.alert('Novo hábito', 'Hábito criado com sucesso!')
    } catch (error) {
      console.log(error)

      Alert.alert('Ops', 'Não foi possível criar o novo hábito.')
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
          className="h-12 pl-4 rounded-lg mt-3 text-white bg-zinc-900 border-2 border-zinc-800 focus:border-green-600"
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
        >
          <Feather 
            name="check"
            size={20}
            color={colors.white}
          />

          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}