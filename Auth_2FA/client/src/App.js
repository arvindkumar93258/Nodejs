import Login from './components/Login';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from './components/Signup';
import PhoneVerify from './components/PhoneVerify';
import Dashboard from './components/Dashboard';
import './styles.css'; 

function App() {
  return (
    <BrowserRouter>
      <div style={{ color: 'white', fontSize: '16px', backgroundColor: 'black' }}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/phone/verify' element={<PhoneVerify/>} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
