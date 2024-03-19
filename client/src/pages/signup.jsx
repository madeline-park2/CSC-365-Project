import React from 'react'
import { useState } from 'react'
import axios from 'axios'
// import { computeHeadingLevel } from '@testing-library/react';
import { useNavigate } from "react-router-dom"

const SignUp = () => {
    const [reader,setReader] = useState({
        email: "",
        password: "",
        fname: "",
        lname: ""
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        setReader(prev=>({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async e =>{
        e.preventDefault()
        try{
            if (reader.email === '' || reader.fname === '' || reader.lname === '' || reader.password === '') {
                window.alert('Cannot have null fields.')
            }
            else {
                await axios.post("http://localhost:8800/reader", reader)
                navigate("/login")
            }
        }catch(err){
            console.log(err)
        }
    };

    return (
        <div className='signup'>
            <div className="header">
                <h1>Sign Up</h1>
            </div>
            <div className="textbox">
                <input type="text" placeholder="email" onChange={handleChange} name="email"/>
                <input type="text" placeholder="password" onChange={handleChange} name="password"/>
                <input type="text" placeholder="first name" onChange={handleChange} name="fname"/>
                <input type="text" placeholder="last name" onChange={handleChange} name="lname"/>
                {/* reader_id, date input in SQL */}
                <button onClick={handleClick}>Add</button>
            </div>
        </div>
    )
}

export default SignUp