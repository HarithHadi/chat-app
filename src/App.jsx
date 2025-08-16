import { useEffect, useState } from "react";
import "./App.css";
import { Chat } from "./components/Chat";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/Login";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) setUser(savedUser);
  }, []);

  return (
    <Router>
      <div className="flex items-center justify-center h-screen">
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/chat" /> : <Login setUser={setUser} />
            }
          />
          <Route
            path="/chat"
            element={
              user ? <Chat user={user} setUser={setUser} /> : <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
