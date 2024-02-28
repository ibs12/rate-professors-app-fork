import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LogInPage from './webpages/loginpage/loginpage';
import SignUpPage from './webpages/signuppage/signuppage';
import StartPage from './webpages/Start/startpage'; // Import the Start component
import Homepage from './webpages/homepage/homepage';
import AccountSettings from './webpages/accountsettings/accountsettings';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/loginpage" element={<LogInPage />} />
          <Route path="/signuppage" element={<SignUpPage />} />
          <Route path="/" element={<StartPage />} /> 
          <Route path="/Homepage" element={<Homepage />} /> 
          <Route path="/accountsettings" element={<AccountSettings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
