import { useState, useEffect, useCallback } from 'react'

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await apiFunction()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message || 'An error occurred')
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  useEffect(() => {
    loadData()
  }, dependencies)

  return { data, loading, error, refetch: loadData }
}

export const useMutation = (apiFunction) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(data)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  return { mutate, loading, error }
}
