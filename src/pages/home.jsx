import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className="homepage">
            <div className="header">
                <h1>Bookworm</h1>
                <h2>Got books?</h2>
            </div>
            <div className="home">
                <div className="button">
                    <button><Link to="/login">Login</Link></button>
                    <button><Link to="/signup">New Here, Sign Up!</Link></button>
                </div>
            </div>
        </div>
    )
}

export default Home