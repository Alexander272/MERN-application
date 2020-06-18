import { useState, useCallback, useEffect } from 'react'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUserId(id)
        localStorage.setItem('Token', jwtToken)
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)

        localStorage.removeItem('Token')
    }, [])

    useEffect(() => {
        const data = localStorage.getItem('Token')
        if (data) {
            login(data)
        }
        setReady(true)
    }, [login])

    return { token, userId, login, logout, ready }
}