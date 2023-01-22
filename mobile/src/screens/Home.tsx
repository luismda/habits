import { useState, useCallback } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications'

import { api } from '../lib/axios'
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'

import { Header } from '../components/Header'
import { HabitDay, daySize } from '../components/HabitDay'
import { Loading } from '../components/Loading'
import dayjs from 'dayjs'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearBeginning = generateDatesFromYearBeginning()

const minimumSummaryDatesSizes = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSizes - datesFromYearBeginning.length

type Summary = {
  id: string
  date: string
  amount: number
  completed: number
}[]

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<Summary>([])

  const { navigate } = useNavigation()

  const toast = useToast()

  async function fetchDataOfSummaryHabits() {
    try {
      setIsLoading(true)

      const response = await api.get('/summary')
      setSummary(response.data)
    } catch (error) {
      console.log(error)

      toast.show('Não foi possível carregar os hábitos de cada dia.', {
        type: 'danger'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchDataOfSummaryHabits()
  }, []))

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, i) => {
          return (
            <Text 
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: daySize }}
            >
              {weekDay}
            </Text>
          )
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearBeginning.map(date => {
            const dayOfSummary = summary.find(day => {
              return dayjs(date).isSame(day.date, 'day')
            })

            return (
              <HabitDay 
                key={date.toString()}
                date={date}
                amount={dayOfSummary?.amount}
                completed={dayOfSummary?.completed}
                onPress={() => navigate('habit', { date: date.toISOString() })}
              />
            )
          })}

          {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
            return (
              <View 
                key={i}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: daySize, height: daySize }}
              />
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}