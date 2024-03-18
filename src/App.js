import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Dashboard from "./pages/dashboard"
import Add from "./pages/signup"
import Home from "./pages/home"
import Login from "./pages/login"
import Search from "./pages/search"
import Recommendation from "./pages/rec"
import "./style.css"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Add/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/rec" element={<Recommendation/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
