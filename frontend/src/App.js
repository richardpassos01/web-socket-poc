import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import NewPage from "./pages/NewPage";
import Loader from "./pages/Loader";
import Timeout from "./pages/Timeout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/newpage" element={<NewPage />} />
        <Route path="/loader" element={<Loader />} />
        <Route path="/timeout" element={<Timeout />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  const [redirect, setRedirect] = useState(false);

  const handleRedirect = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/loader" />;
  }

  return (
    <div className="App">
      <h1>WebSocket React App</h1>
      <button onClick={handleRedirect}>Redirect</button>
    </div>
  );
}

export default App;
