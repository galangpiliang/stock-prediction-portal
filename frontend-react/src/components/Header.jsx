import React from 'react'

const Header = () => {
    return (
        <>
            <nav className="navbar container pt-3 pb-3 align-items-start">
                <a className='navbar-brand text-light' href="">Stock Prediction Portal</a>

                <div>
                    <a href="" className="btn btn-outline-info">Login</a>
                    &nbsp;
                    <a href="" className="btn btn-info">Register</a>
                </div>
            </nav>
        </>
    )
}

export default Header