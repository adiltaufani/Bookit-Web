import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handleSignup  from '../signup';
import handleLogin  from '../login';

const AuthForm = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const onSignup = () => {
    handleSignup(signupData)
      .then(() => console.log('Signup successful'))
      .catch(error => console.error('Signup error:', error));
  };

  const onLogin = () => {
    handleLogin(loginData, navigate)
      .then(() => console.log('Login successful'))
      .catch(error => console.error('Login error:', error));
  };

  return (
    <div className="main">
      <input type="checkbox" id="chk" aria-hidden="true" />
      <div className="signup">
        <form id="signupForm">
          <label htmlFor="chk" aria-hidden="true">Sign up</label>
          <input type="text" name="username" id="signupUsername" placeholder="User name" required value={signupData.username} onChange={handleSignupChange} />
          <input type="email" name="email" id="signupEmail" placeholder="Email" required value={signupData.email} onChange={handleSignupChange} />
          <input type="password" name="password" id="signupPassword" placeholder="Password" required value={signupData.password} onChange={handleSignupChange} />
          <button type="button" id="register" name="register" className="btn btn-success" onClick={onSignup}>Sign up</button>
        </form>
      </div>

      <div className="login">
        <form id="loginForm">
          <label htmlFor="chk" aria-hidden="true">Login</label>
          <input type="email" name="email" id="loginEmail" placeholder="Email" required value={loginData.email} onChange={handleLoginChange} />
          <input type="password" name="password" id="loginPassword" placeholder="Password" required value={loginData.password} onChange={handleLoginChange} />
          <button type="button" id="login" name="login" className="btn btn-success" onClick={onLogin}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
