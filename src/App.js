import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './components/Auth/AuthForm';
import HomePage from './components/Home/HomePage';
import MyProperty from './components/MyProperty/MyProperty';
import AddProperty from './components/AddProperty/AddProperty';
import ChatComponent from './components/Chat/ChatComponen';
import Notification from './components/Notification/Notification';
import './app.scss';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={localStorage.getItem('userUID') ? <HomePage /> : <AuthForm/>} />
        <Route path="/myproperty" element={<MyProperty />} />
        <Route path="/addproperty" element={<AddProperty />} />
        <Route path="/chat" element={<ChatComponent />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </Router>
  );
};

export default App;
