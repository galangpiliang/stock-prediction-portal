import React from 'react'
import { Link } from 'react-router-dom'

const Button = (props) => {
    return (
        <>
            <Link to={props.link} className={`btn ${props.class || "btn-info"}`}>{props.text || "Text"}</Link>
        </>
    )
}

export default Button