import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home } from "./pages/Home/Home";
import { NewRoom } from "./pages/NewRoom/NewRoom";
import { AdminRoom } from "./pages/AdminRoom/AdminRoom";
import { Room } from "./pages/Room/Room";

import { AuthContextProvider } from "./contexts/AuthContext";
const App = () => {

  return (
    <BrowserRouter>
        <AuthContextProvider>
          <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/rooms/new" element={<NewRoom/>} />
              <Route path="/rooms/:id" element={<Room/>}/>
              <Route path="/admin/rooms/:id" element={<AdminRoom/>} />

          </Routes>
        </AuthContextProvider>
    </BrowserRouter>
    
  )
}

export default App;
