import { useState, useEffect } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import { clsx } from 'clsx'
import { useToast } from 'react-native-toast-notifications'

import { api } from '../lib/axios'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'

import { BackButton } from '../components/BackButton'
import { ProgressBar } from '../components/ProgressBar'
import { Checkbox } from '../components/Checkbox'
import { Loading } from '../components/Loading'
import { HabitsListEmpty } from '../components/HabitsListEmpty'

interface HabitParams {
  date: string
}

interface DayInfo {
  possibleHabits: {
    id: string
    title: string
    created_at: string
  }[]
  completedHabits: string[]
}

export function Habit() {
  const [isLoading, setIsLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<DayInfo | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const toast = useToast()

  const route = useRoute()
  const { date } = route.params as HabitParams

  const parsedDate = dayjs(date)
  const nameOfWeekDay = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')
  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

  const completedProgressPercentage = 
    generateProgressPercentage(dayInfo?.possibleHabits.length ?? 0, completedHabits.length)

  async function fetchHabits() {
    try {
      setIsLoading(true)

      const response = await api.get<DayInfo>('/day', {
        params: {
          date
        }
      })

      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)
    } catch (error) {
      console.log(error)

      toast.show('Não foi possível carregar os hábitos desse dia.', {
        type: 'danger'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleCompletedHabit(habitId: string) {
    try {
      if (completedHabits.includes(habitId)) {
        setCompletedHabits(state => state.filter(id => id !== habitId))
      } else {
        setCompletedHabits(state => [...state, habitId])
      }

      await api.patch(`/habits/${habitId}/toggle`)
    } catch (error) {
      console.log(error)
      toast.show('Não foi possível atualizar o status do hábito.', {
        type: 'danger'
      })
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {nameOfWeekDay}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={completedProgressPercentage} />

        <View className={clsx('mt-6', {
          'opacity-50': isDateInPast
        })}>
          {dayInfo?.possibleHabits.map(habit => {
            return (
              <Checkbox 
                key={habit.id}
                title={habit.title}
                disabled={isDateInPast}
                checked={completedHabits.includes(habit.id)}
                onPress={() => handleToggleCompletedHabit(habit.id)}
              />
            )
          })}

          {!dayInfo?.possibleHabits && (
            <HabitsListEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-zinc-400 text-base text-center mt-10">
            Você não pode editar hábitos de uma data passada.
          </Text>
        )}
      </ScrollView>
    </View>
  )
}