'use client'

import { useState, useEffect } from 'react'

export interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  isLive: boolean
}

function compute(targetISO: string | null): CountdownValues {
  if (!targetISO) return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true }
  const diff = new Date(targetISO).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds, isLive: false }
}

export function useCountdown(targetISO: string | null): CountdownValues {
  // Start with zeros to avoid SSR/hydration mismatch; populate on mount
  const [values, setValues] = useState<CountdownValues>({
    days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false,
  })

  useEffect(() => {
    setValues(compute(targetISO))
    const id = setInterval(() => setValues(compute(targetISO)), 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return values
}
