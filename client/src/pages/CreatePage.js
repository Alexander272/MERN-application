import React, { useState, useContext } from 'react'
import { useHttp } from './../hooks/http.hook'
import { AuthContext } from './../context/AuthContext'
import { useHistory } from 'react-router-dom';

export const CreatePage = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const { request } = useHttp()
    const [link, setLink] = useState('')

    const pressHandler = async event => {
        if (event.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', { from: link }, { Authtorization: `Bearer ${auth.token}` })
                history.push(`/detail/${data.link._id}`)
            } catch (error) {}
        }
    }

    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
                <div className="input-field">
                    <input
                        id="email"
                        type="text"
                        name="link"
                        className="validate"
                        value={ link }
                        onChange={ e => setLink(e.target.value) }
                        onKeyPress={ pressHandler }
                    />
                    <label htmlFor="link">Вставте ссылку</label>
                </div>
            </div>
        </div>
    )
}