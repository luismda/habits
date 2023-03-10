import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'
import { HabitDay } from './HabitDay'
import { Loading } from './Loading'
import { api } from '../lib/axios'
import { useToast } from '../hooks/useToast'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 17 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
  id: string
  date: string
  amount: number
  completed: number
}[]

export function SummaryTable() {
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<Summary>([])

  const { showToast } = useToast()

  useEffect(() => {
    try {
      api.get('/summary').then(response => {
        setSummary(response.data)
      })
    } catch {
      showToast({
        type: 'error',
        title: 'Ops...',
        description: 'Não foi possível carregar seus hábitos.'
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="w-full flex items-start">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid gap-3 grid-rows-7 grid-flow-row p-2">
            {weekDays.map((weekDay, i) => {
              return (
                <div
                  key={`${weekDay}-${i}`}
                  className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
                >
                  {weekDay}
                </div>
              )
            })}
          </div>
    
          <div className="grid grid-rows-7 grid-flow-col gap-3 p-2 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-thumb-rounded-lg">
            {summary.length > 0 && summaryDates.map(date => {
              const dayInSummary = summary.find(day => {
                return dayjs(date).isSame(day.date, 'day')
              })

              return (
                <HabitDay 
                  key={date.toString()} 
                  date={date}
                  amount={dayInSummary?.amount}
                  defaultCompleted={dayInSummary?.completed}
                />
              )
            })}

            {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => {
              return (
                <div 
                  key={index}
                  className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" 
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}