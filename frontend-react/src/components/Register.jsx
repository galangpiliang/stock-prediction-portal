import React, {useState} from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Register = () => {
    const [username, SetUsername] = useState('')
    const [email, SetEmail] = useState('')
    const [password, SetPassword] = useState('')
    const [errors, SetErrors] = useState({})
    const [success, SetSuccess] = useState(false)
    const [loading, SetLoading] = useState(false)

    const handleRegistration = async (e) =>{
        e.preventDefault()
        SetLoading(true)

        const userData = {
            username, email, password
        }

        try {
            SetSuccess(false)
            SetErrors({})
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', userData)
            console.log('Response Data ==>', response)
            console.log('Registration Successful')
            SetSuccess(true)
        } catch (error) {
            SetErrors(error.response.data)
            console.error('Registration Error: ', error.response.data)
        }finally{
            SetLoading(false)
        }
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 bg-light-dark p-5 rounded">
                        <h3 className="text-light text-center mb-4">Create an Account</h3>
                        <form onSubmit={handleRegistration}>
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder='Enter username' value={username} onChange={(e) => SetUsername(e.target.value)}/>
                                { errors.username &&
                                    <div class="text-warning mt-1">
                                        {errors.username}
                                    </div>
                                }
                            </div>
                            <div className="mb-3">
                               <input type="email" className="form-control" placeholder='Enter email address' value={email} onChange={(e) => SetEmail(e.target.value)}/>
                                { errors.email &&
                                    <div class="text-warning mt-1">
                                        {errors.email}
                                    </div>
                                }
                            </div>
                            <div className="mb-3">
                                <input type="password" className="form-control" placeholder='Set password' value={password} onChange={(e) => SetPassword(e.target.value)}/>
                                { errors.password &&
                                    <div class="text-warning mt-1">
                                        {errors.password}
                                    </div>
                                }
                            </div>
                            {
                                success &&
                                <div className="alert alert-success">Registration Successfull</div>
                            }
                            {
                                loading ? (
                                    <button type='submit' className="btn btn-info d-block mx-auto mt-1" disabled><FontAwesomeIcon icon={faSpinner} spin /> Please Wait...</button>
                                ) : (
                                    <button type='submit' className="btn btn-info d-block mx-auto mt-1">Register</button>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register