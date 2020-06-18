import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import { LinksList } from '../components/LinksList'

export const LinksPage = () => {
    const [links, setLinks] = useState([])
    const { token } = useContext(AuthContext)
    const { loading, request } = useHttp()

    const fetchLinks = useCallback(async () => {
        try {
            const fetched = await request('/api/link', 'GET', null, { Authtorization: `Bearer ${token}` })
            setLinks(fetched)
        } catch (error) {}
    }, [token, request])

    useEffect(() => { fetchLinks() }, [fetchLinks])

    if (loading) return <Loader />

    return (
        <>
            { !loading && <LinksList links={ links } /> }
        </>
    )
}