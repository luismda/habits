import { SVGAttributes } from 'react'
import { CircleNotch } from 'phosphor-react'
import { clsx } from 'clsx'
import colors from 'tailwindcss/colors'

interface LoadingProps extends SVGAttributes<HTMLOrSVGElement> {
  color?: string
  size?: number
}

export function Loading({ 
  color = colors.violet[600], 
  size = 32, 
  className, 
  ...rest 
}: LoadingProps) {
  return (
    <CircleNotch 
      size={size}
      weight="bold"
      color={color}
      className={clsx('mx-auto animate-spin', className)}
      aria-label="Carregando"
      aria-live="polite"
      {...rest}
    />
  )
}