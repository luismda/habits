import { TouchableOpacity, TouchableOpacityProps, Dimensions } from 'react-native'
import dayjs from 'dayjs'
import { clsx } from 'clsx'

import { generateProgressPercentage } from '../utils/generate-progress-percentage'

const numberOfWeekDays = 7
const screenHorizontalPadding = (32 * 2) / 5

export const dayMarginBetween = 8
export const daySize = (Dimensions.get('screen').width / numberOfWeekDays) - (screenHorizontalPadding + 5)

interface HabitDayProps extends TouchableOpacityProps {
  date: Date
  amount?: number
  completed?: number
}

export function HabitDay({ date, amount = 0, completed = 0, ...rest }: HabitDayProps) {
  const progressPercentageOfDay = generateProgressPercentage(amount, completed)

  const today = dayjs().startOf('day').toDate()
  const isCurrentDay = dayjs(date).isSame(today)

  return (
    <TouchableOpacity 
      className={clsx('rounded-lg border-2 m-1', {
        'bg-zinc-900 border-zinc-800': progressPercentageOfDay === 0,
        'bg-violet-900 border-violet-700': progressPercentageOfDay > 0 && progressPercentageOfDay < 20,
        'bg-violet-800 border-violet-600': progressPercentageOfDay >= 20 && progressPercentageOfDay < 40,
        'bg-violet-700 border-violet-500': progressPercentageOfDay >= 40 && progressPercentageOfDay < 60,
        'bg-violet-600 border-violet-500': progressPercentageOfDay >= 60 && progressPercentageOfDay < 80,
        'bg-violet-500 border-violet-400': progressPercentageOfDay >= 80,
        'border-white border-4': isCurrentDay
      })}
      style={{ width: daySize, height: daySize }}
      activeOpacity={0.7}
      {...rest}
    />
  )
}