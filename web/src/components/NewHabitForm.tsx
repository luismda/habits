import { useState, FormEvent } from 'react'
import { Check } from 'phosphor-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import colors from 'tailwindcss/colors'

import { api } from '../lib/axios'
import { useToast } from '../hooks/useToast'
import { Loading } from './Loading'

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
]

export function NewHabitForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])

  const { showToast } = useToast()

  async function handleCreateNewHabit(event: FormEvent) {
    event.preventDefault()

    if (!title || weekDays.length === 0) {
      return showToast({
        type: 'error',
        title: 'Ops...',
        description: 'Informe o hábito e pelo menos um dia da semana.'
      })
    }

    try {
      setIsLoading(true)

      await api.post('/habits', {
        title,
        weekDays
      })
  
      setTitle('')
      setWeekDays([])

      showToast({
        type: 'success',
        title: 'Pronto!',
        description: 'Hábito criado com sucesso!'
      })
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Ops...',
        description: 'Não foi possível criar o hábito.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleToggleWeekDays(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays.filter(day => day !== weekDay)

      setWeekDays(weekDaysWithRemovedOne)
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay]

      setWeekDays(weekDaysWithAddedOne)
    }
  }

  return (
    <form onSubmit={handleCreateNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprometimento?
      </label>

      <input 
        type="text"
        id="title"
        placeholder="ex.: Exercícios, dormir bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
        autoFocus
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((weekDay, index) => {
          return (
            <Checkbox.Root 
              key={weekDay}
              className="flex items-center gap-3 focus:outline-none group"
              checked={weekDays.includes(index)}
              onCheckedChange={() => handleToggleWeekDays(index)}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 transition-colors group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900">
                <Checkbox.Indicator>
                  <Check 
                    size={20}
                    className="text-white"
                  />
                </Checkbox.Indicator> 
              </div>

              <span className="text-white leading-tight">
                {weekDay}
              </span>
            </Checkbox.Root>
          )
        })}
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold transition-colors bg-green-600 hover:bg-green-500 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        {isLoading ? (
          <Loading color={colors.white} size={24} />
        ) : (
          <>
            <Check size={20} weight="bold" />
            Confirmar
          </>
        )}
      </button>
    </form>
  )
}