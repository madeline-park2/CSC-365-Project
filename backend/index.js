import express from "express"
import mysql from "mysql2"
import cors from "cors"
import readline from "readline"

const app = express();

// allows command line input for MySQL root user password
function login(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}


var userInput = await login("Enter your MySQL password: ");

// connects to database
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: userInput,    /* use your own password here */
    database:"book_project"
})

app.use(express.json());
app.use(cors());

app.get("/", (req,res)=>{
    res.json("hello this is the backend");
})

app.get("/books", (req,res)=>{
    const q = "SELECT * FROM book_project.book LIMIT 100"   /* this was a tester function but it also is the default
                                                                behavior of the search page if no data is input */
    db.query(q,(err,data)=>{                                    
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.get("/books/:book_title", (req,res)=>{
    const q = "SELECT * FROM book_project.book WHERE book_title LIKE ?";     /* search by title function */
    var val1 = req.params.book_title;
    val1 = "%" + val1 + "%";
    db.query(q,[val1],(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

// gets booklist
app.get("/booklist/:reader_id", (req,res)=>{
    const q = "SELECT * FROM book_project.booklist JOIN book_project.book WHERE booklist.book_id = book.book_id AND booklist.reader_id = ?";
    var val1 = req.params.reader_id;
    db.query(q,[val1],(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

// gets recommendations for reader
app.get("/booklist/recommendations/:reader_id", (req,res)=>{
    const q = "SELECT DISTINCT b.book_title, b.rating, b.cover_img FROM book b JOIN has_genre hg ON b.book_id = hg.book_id JOIN genre g ON hg.genre_id = g.genre_id LEFT JOIN (SELECT hg_list.genre_id, COUNT(*) AS genre_count FROM booklist bl JOIN has_genre hg_list ON bl.book_id = hg_list.book_id WHERE bl.reader_id = ? AND bl.reader_rating >= 4 GROUP BY hg_list.genre_id HAVING COUNT(*) > 1) AS bt ON g.genre_id = bt.genre_id WHERE b.book_id NOT IN (SELECT bl.book_id FROM booklist bl WHERE bl.reader_id = ?) AND bt.genre_id IS NOT NULL AND b.rating > 4.5 ORDER BY b.rating DESC LIMIT 30";
    var val1 = req.params.reader_id;
    db.query(q,[val1, val1],(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

// adds a book into the booklist
app.post("/booklist", (req,res)=>{
    const q = "INSERT INTO book_project.booklist (`reader_id`, `book_id`, `reader_rating`) VALUES (?)";
    const values = [
        req.body.reader_id,
        req.body.book_id,
        req.body.rating,
    ];
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

// gets all entries on booklist
app.get("/booklist", (req,res)=>{
    const q = "SELECT * FROM book_project.booklist";
    db.query(q,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

// login function so that a reader can have an account
app.get("/login/:reader_email/:reader_pass", (req,res)=>{
    const q = "SELECT * FROM book_project.reader WHERE reader_email = ? AND reader_password = ?";
    const val1 = req.params.reader_email;
    const val2 = req.params.reader_pass;
    
    db.query(q,[val1,val2],(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

// creates a reader account
app.post("/reader", (req,res)=>{
    const q = "INSERT INTO book_project.reader (`reader_email`, `reader_password`, `reader_fname`, `reader_lname`) VALUES (?)"
    const values = [
        req.body.email,
        req.body.password,
        req.body.fname,
        req.body.lname,
    ];
    db.query(q,[values], (err,data)=>{
        if(err) return res.json(err);
        return res.json("okay");
    })
})

app.listen(8800, ()=>{
    console.log("Connected to backend!");
})