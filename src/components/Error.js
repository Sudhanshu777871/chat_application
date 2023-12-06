import React, { Component } from 'react'
import  errorImg  from './img/404_gif.gif'
export class Error extends Component {
    render() {
        return (
            <>
                <img src={errorImg} alt="404 Error" style={{ width: '100vw', height: '100vh', objectFit: 'contain' }} />
            </>
        )
    }
}

export default Error
