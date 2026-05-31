import { createContext, useContext, useState, type ReactNode } from 'react'

interface MobileMenuContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const MobileMenuContext = createContext<MobileMenuContextValue | null>(null)

export const MobileMenuProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuContext.Provider>
  )
}

export const useMobileMenu = () => {
  const ctx = useContext(MobileMenuContext)
  if (!ctx) {
    return { isOpen: false, setIsOpen: () => {} }
  }
  return ctx
}
