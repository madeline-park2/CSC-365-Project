import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { Link} from "react-router-dom"

const Recommendations = () => {
    const [recs,setRecs] = useState([])
    const location = useLocation();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get("http://localhost:8800/booklist/recommendations/"+location.state.id[0]["reader_id"])
                setRecs(res.data)
            } catch(err) {
                console.log(err)
            }
        }
        fetchAll()
    })

    const navigate = useNavigate()

    const handleClick = async e =>{
        e.preventDefault()
        try{
            navigate("/dashboard", {
                state: {
                    id: location.state.id
                }
            })
        }catch(err){
            console.log(err)
        }
    };

    return (
        <div>
            <div className="header">
                <h1>Recommendations</h1>
            </div>
            <div className="recs">
                <Link to='/login/'>
                <button onClick={handleClick}>Back</button>
                </Link>
                <h4>Your Recommendations</h4>
                <div className="booklist">
                    {"no books yet!" && recs.map((recs) =>(
                        <div className="books" key={recs.book_id}>
                            <h5>{recs.book_title}</h5>
                            <img src={recs.cover_img} alt="" />
                            <h5>As Rated by Others: {recs.rating}</h5>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Recommendations