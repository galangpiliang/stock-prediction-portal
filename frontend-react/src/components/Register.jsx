import React, {useState} from 'react'

const Register = () => {
    const [username, SetUsername] = useState('')
    const [email, SetEmail] = useState('')
    const [password, SetPassword] = useState('')

    const handleRegistration = (e) =>{
        e.preventDefault()

        const userData = {
            username, email, password
        }

        console.log(userData)
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 bg-light-dark p-5 rounded">
                        <h3 className="text-light text-center mb-4">Create an Account</h3>
                        <form onSubmit={handleRegistration}>
                            <input type="text" className="form-control mb-3" placeholder='Enter username' value={username} onChange={(e) => SetUsername(e.target.value)}/>
                            <input type="email" className="form-control mb-3" placeholder='Enter email address' value={email} onChange={(e) => SetEmail(e.target.value)}/>
                            <input type="password" className="form-control mb-5" placeholder='Set password' value={password} onChange={(e) => SetPassword(e.target.value)}/>
                            <button type='submit' className="btn btn-info d-block mx-auto">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register