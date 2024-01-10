import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import { AuthProvider } from "./context/AuthContext";
import "materialize-css/dist/css/materialize.min.css";
import { useEffect } from "react";
import M from "materialize-css";
import ProtectedRoute from "./ProtectedRoute";
import Chat from "./pages/chat/Chat";
import Register from "./pages/register/Register";

function App() {
  useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route Component={ProtectedRoute}>
              <Route path="/chat" Component={Chat} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
