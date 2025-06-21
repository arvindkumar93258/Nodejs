import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
//App parts imports
import Register from './components/Register';
import Setup2FA from './components/Setup2FA';
import Verify2FALogin from './components/Verify2FALogin';
import Disable2FA from './components/Disable2FA';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <div style={{ color: 'white', fontSize: '16px', backgroundColor: 'black' }}>
        <Routes>
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={ <Login />} />
          <Route path='/setup-2fa' element={<Setup2FA />} />
          <Route path='/verify-2fa-login' element={<Verify2FALogin />} />
          <Route path='/disable-2fa' element={<Disable2FA />} />
          <Route path='/home' element={<Home />} />
          <Route path='/' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
