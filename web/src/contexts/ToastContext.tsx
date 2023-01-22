import { createContext, ReactNode, useState } from 'react'
import { Toast } from '../components/Toast'

interface ToastProps {
  type: 'success' | 'error'
  title: string
  description: string
}

interface ToastContextProps {
  isOpen: boolean
  toastInfo: ToastProps
  showToast: (props: ToastProps) => void
  closeToast: () => void
}

export const ToastContext = createContext({} as ToastContextProps)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [toastInfo, setToastInfo] = useState<ToastProps>({} as ToastProps)

  function showToast(props: ToastProps) {
    setIsOpen(true)
    setToastInfo(props)

    setTimeout(() => {
      setIsOpen(false)
    }, 5000)
  }

  function closeToast() {
    setIsOpen(false)
  }

  return (
    <ToastContext.Provider 
      value={{ 
        isOpen, 
        showToast, 
        closeToast, 
        toastInfo 
      }}
    >
      {children}

      <Toast />
    </ToastContext.Provider>
  )
}