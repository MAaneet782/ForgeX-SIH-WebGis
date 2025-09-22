"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // The error "React.Children.only expected to receive a single React element child"
  // suggests that the underlying NextThemesProvider might be expecting a single child element
  // to which it can pass props. By wrapping the children in a single div, we ensure
  // this condition is always met, which can resolve this specific error.
  return <NextThemesProvider {...props}><div>{children}</div></NextThemesProvider>
}