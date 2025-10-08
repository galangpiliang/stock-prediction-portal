import React, {useState} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [username, SetUsername] = useState('')
    const [password, SetPassword] = useState('')
    const [error, SetError] = useState('')
    const [success, SetSuccess] = useState(false)
    const [loading, SetLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) =>{
        e.preventDefault()
        SetLoading(true)

        const userData = {
            username, password
        }

        try {
            SetSuccess(false)
            SetError('')
            const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData)
            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)
            console.log('Login successful')
            SetSuccess(true)
            navigate('/')
        } catch (error) {
            console.error('Invalid Credentials')
            SetError('Invalid Credentials')
        }finally{
            SetLoading(false)
        }
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 bg-light-dark p-5 rounded">
                        <h3 className="text-light text-center mb-4">Login to our Portal</h3>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder='Enter username' value={username} onChange={(e) => SetUsername(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" placeholder='Set password' value={password} onChange={(e) => SetPassword(e.target.value)}/>
                            </div>
                            {   
                                error &&
                                <div className="text-warning mt-1">
                                    {error}
                                </div>
                            }
                            {
                                loading ? (
                                    <button type='submit' className="btn btn-info d-block mx-auto mt-1" disabled><FontAwesomeIcon icon={faSpinner} spin /> Logging in...</button>
                                ) : (
                                    <button type='submit' className="btn btn-info d-block mx-auto mt-1">Login</button>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login