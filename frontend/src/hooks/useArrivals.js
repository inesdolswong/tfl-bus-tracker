import { useState, useEffect, useCallback } from 'react'

const REFRESH_INTERVAL_MS = 30_000

export function useArrivals() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchArrivals = useCallback(async () => {
    try {
      const res = await fetch('/api/arrivals')
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const json = await res.json()
      setData(json.stops)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArrivals()
    const id = setInterval(fetchArrivals, REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchArrivals])

  return { data, loading, error }
}
