import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login";
import Pages from "./Pages";

const URL = "http://localhost:3000";
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pages" element={<Pages />} />
      </Routes>
    </Router>
  );
}

export default App;