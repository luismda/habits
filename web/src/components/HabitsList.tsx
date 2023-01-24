import { useEffect, useState } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'phosphor-react'
import dayjs from 'dayjs'

import { api } from '../lib/axios'
import { useToast } from '../hooks/useToast'
import { Loading } from './Loading'

interface HabitsListProps {
  date: Date
  onCompletedChanged: (completed: number) => void
}

interface HabitsInfo {
  possibleHabits: {
    id: string
    title: string
    created_at: string
  }[],
  completedHabits: string[]
}

export function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  const { showToast } = useToast()

  useEffect(() => {
    try {
      setIsLoading(true)

      api.get('/day', {
        params: {
          date: date.toISOString()
        }
      }).then(response => {
        setHabitsInfo(response.data)
      })
    } catch {
      showToast({
        type: 'error',
        title: 'Ops...',
        description: 'Não foi possível carregar sua lista de hábitos.'
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  async function handleToggleHabit(habitId: string) {
    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)

    let completedHabits: string[] = []

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId]
    }

    setHabitsInfo(state => {
      return {
        possibleHabits: state!.possibleHabits,
        completedHabits
      }
    })

    onCompletedChanged(completedHabits.length)

    await api.patch(`/habits/${habitId}/toggle`)
  } 

  const isDateInPast = dayjs(date)
    .endOf('day')
    .isBefore(new Date())

  return (
    <div className="mt-6 p-1 flex flex-col gap-3 max-h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-thumb-rounded-lg">
      {isLoading ? (
        <Loading className="my-1" />
      ) : (
        habitsInfo?.possibleHabits.map(habit => {
          return (
            <Checkbox.Root 
              key={habit.id}
              onCheckedChange={() => handleToggleHabit(habit.id)}
              checked={habitsInfo.completedHabits.includes(habit.id)}
              disabled={isDateInPast}
              className="flex items-center gap-3 focus:outline-none disabled:cursor-not-allowed group"
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 transition-colors group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
                <Checkbox.Indicator>
                  <Check 
                    size={20}
                    className="text-white"
                  />
                </Checkbox.Indicator> 
              </div>

              <span className="font-semibold text-xl text-white leading-tight transition-colors group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                {habit.title}
              </span>
            </Checkbox.Root>
          )
        })
      )}
    </div>
  )
}