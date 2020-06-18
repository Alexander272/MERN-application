import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useCallback } from 'react'
import { useHttp } from '../hooks/http.hook'
import { Loader } from '../components/Loader'
import { LinkCard } from '../components/LinkCard'
import { AuthContext } from '../context/AuthContext'

export const DetailPage = () => {
    const { token } = useContext(AuthContext)
    const { loading, request } = useHttp()
    const [link, setLink] = useState(null)
    const linkId = useParams().id

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, { Authtorization: `Bearer ${token}` })
            setLink(fetched)
        } catch (error) {}
    }, [token, linkId, request])

    useEffect(() => { getLink() }, [getLink])

    if (loading) return <Loader />

    return (
        <>
            { !loading && link && <LinkCard link={ link } /> }
        </>
    )
}