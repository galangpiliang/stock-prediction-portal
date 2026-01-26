import React, {useContext, useState} from 'react'
import axiosInstance from '../axiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../AuthProvider'

const Login = () => {
    const [demoLoading, SetDemoLoading] = useState(false)
    const [username, SetUsername] = useState('')
    const [password, SetPassword] = useState('')
    const [error, SetError] = useState('')
    const [loading, SetLoading] = useState(false)
    const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)

    const performLogin = async (endpoint, data, loaderFunc) => {
        try {
            SetError('')
            const response = await axiosInstance.post(endpoint, data)
            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)
            setIsLoggedIn(true)
        } catch (error) {
            SetError('Login failed. Please try again.')
        } finally {
            loaderFunc(false)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        SetLoading(true)
        // Calls standard JWT endpoint with credentials
        await performLogin('/token/', { username, password }, SetLoading)
    }

    const handleDemoLogin = async () => {
        SetDemoLoading(true)
        // Calls custom endpoint with NO credentials (handled by backend)
        await performLogin('/demo-login/', {}, SetDemoLoading)
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center p-3">
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
                            <button 
                                type="button" 
                                className="btn btn-outline-info d-block mx-auto mt-2" 
                                onClick={handleDemoLogin}
                                disabled={demoLoading || loading}
                            >
                                {demoLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Try Demo Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login