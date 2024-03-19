import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import {useNavigate } from "react-router-dom"

const Search = () => {
    const location = useLocation()

    const [search,setSearch] = useState({
        title: ""
    });
    
    const [book,setBook] = useState([]);

    const [booklist,setBooklist] = useState({
        reader_id: location.state.id[0]["reader_id"],
        book_id: 0,
        rating: 0
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        setSearch(prev=>({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleChangeBooklist = (e) => {
        setBooklist(prev=>({ ...prev, [e.target.name]: Number(e.target.value) }));
    };

    const HandleClick = async (book_title) => {
        try{
            var res = await axios.get("http://localhost:8800/books/"+book_title)
            setBook(res.data)
        }catch(err){
            console.log(err)
        }
    };

    const handleClickBack = async e =>{
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

    const HandleClickBooklist = async (book_id) =>{
        try{
            booklist.book_id = book_id
            if (booklist.rating > 5.0 || booklist.rating < 0.0) {
                window.alert("Rating out of range.")
            }
            else {
                await axios.post("http://localhost:8800/booklist", booklist)
            }
        }catch(err){
            console.log(err)
        }
    };

    return (
        <div>
            <h1>Books</h1>
            <div className="searches" key={search.book_title}>
                <input type="text" placeholder="search" onChange={handleChange} name="title"/>
                <button onClick={()=>HandleClick(search.title)}>Search</button>
                <button onClick={handleClickBack}>Back</button>
                {book.map((book) =>(
                    <div className="search" key={book.book_id}>
                        <h3>{book.book_title}</h3>
                        <img src={book.cover_img} alt="" />
                        <button onClick={()=>HandleClickBooklist(book.book_id)}>Add to Booklist</button>
                        <input type="integer" placeholder="Rate 0-5" onChange={handleChangeBooklist} name="rating"/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Search