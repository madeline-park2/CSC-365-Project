import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { Link} from "react-router-dom"

const Dashboard = () => {
    const [booklist,setBook] = useState([])
    const location = useLocation();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get("http://localhost:8800/booklist/"+location.state.id[0]["reader_id"])
                setBook(res.data)
            } catch(err) {
                console.log(err)
            }
        }
        fetchAll()
    })

    const navigate = useNavigate()
    const fname = location.state.id[0]["reader_fname"];

    const handleClick = async e =>{
        e.preventDefault()
        try{
            navigate("/search", {
                state: {
                    id: location.state.id
                }
            })
        }catch(err){
            console.log(err)
        }
    };

    const handleClick2 = async e =>{
        e.preventDefault()
        try{
            navigate("/rec", {
                state: {
                    id: location.state.id
                }
            })
        }catch(err){
            console.log(err)
        }
    };

    const handleClick3 = async e =>{
        e.preventDefault()
        try{
            navigate("/")
        }catch(err){
            console.log(err)
        }
    };

    return (
        <div>
            <div className="header">
                <h1>Welcome, {fname}</h1>
            </div>
            <div className="main">
                <Link to='/login/'>
                <button onClick={handleClick}>Search</button>
                </Link>
                <Link to='/login/'>
                <button onClick={handleClick2}>Recommendations</button>
                </Link>
                <button onClick={handleClick3}>Logout</button>
                <h4>Your Booklist</h4>
                <div className="booklist">
                {"no books yet!" && booklist.map((booklist)=>(
                    <div className="books" key={booklist.book_id}>
                        <h5>{booklist.book_title}</h5>
                        <img src={booklist.cover_img} alt="" />
                        <h5>Your Rating: {booklist.reader_rating}</h5>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard