// src/login.js
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const handleLogin = (loginData, navigate) => {
  const { email, password } = loginData;
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      alert(user.email + " Login successfully!!!");
      localStorage.setItem('userUID', user.uid);
      navigate("/home");
    })
    .catch((error) => {
      console.log(error.message);
      alert(error.message);
      throw error;
    });
};

export default handleLogin;