import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'phosphor-react'
import { clsx } from 'clsx'

import { useToast } from '../hooks/useToast'

export function Toast() {
  const { isOpen, closeToast, toastInfo } = useToast()

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root 
        open={isOpen}
        className={clsx('absolute w-full flex items-center justify-between gap-3 p-5 bg-zinc-900 ring-2 rounded-2xl data-[state=open]:animate-slideIn data-[state=closed]:animate-hide', {
          'ring-green-600': toastInfo.type === 'success',
          'ring-red-600': toastInfo.type === 'error'
        })}
      >
        <div>
          <ToastPrimitive.Title className="font-bold text-xl leading-tight">
            {toastInfo.title}
          </ToastPrimitive.Title>

          <ToastPrimitive.Description className="text-zinc-400">
            {toastInfo.description}
          </ToastPrimitive.Description>
        </div>

        <ToastPrimitive.Close 
          onClick={closeToast}
          className="rounded-lg h-6 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          <X size={24} aria-label="Fechar" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport className="fixed top-4 right-4 w-80 z-10" />
    </ToastPrimitive.Provider>
  )
}