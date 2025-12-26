import { useEffect, useState } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  return { toasts, showToast }
}

export function ToastContainer({ toasts }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  )
}

function Toast({ message, type }) {
  const styles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
  }

  return (
    <div className={`${styles[type]} px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`}>
      <span>
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
        {type === 'warning' && '⚠'}
      </span>
      <span className="font-medium">{message}</span>
    </div>
  )
}