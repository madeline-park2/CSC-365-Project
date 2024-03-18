import React from 'react'
import { useState } from 'react'
// import { useEffect } from 'react'
import axios from 'axios'
// import { computeHeadingLevel } from '@testing-library/react';
import { Link, useNavigate } from "react-router-dom"

const Login = () => {
    const [reader,setReader] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        setReader(prev=>({ ...prev, [e.target.name]: e.target.value }));
    };

    const HandleClick = async (reader_email, reader_password) => {
        try{
            var res = await axios.get("http://localhost:8800/login/"+reader_email+"/"+reader_password)
            var test = res.data.length
            if (test === 0) {
                window.alert('Email or password incorrect.')
            }
            else {
                navigate("/dashboard", {
                    state: {
                        id: res.data
                    }
                })
            }
        }catch(err){
            console.log(err)
        }
    };

    return (
        <div className="login">
            <div className="header">
                <h1>Login</h1>
            </div>
                <div className="reader" key={[reader.reader_email, reader.reader_password]}>
                    <input type="text" placeholder="email" onChange={handleChange} name="email"/>
                    <input type="text" placeholder="password" onChange={handleChange} name="password"/>
                    {/* reader_id, date input in SQL */}
                    <Link to='/login/'>
                        <button onClick={()=>HandleClick(reader.email, reader.password)}>Login</button>
                    </Link>
                </div>
        </div>
    )
}

export default Login