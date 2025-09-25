import React from 'react'

const Button = (props) => {
    return (
        <>
            <a href="" className={`btn ${props.class || "btn-info"}`}>{props.text || "Text"}</a>
        </>
    )
}

export default Button