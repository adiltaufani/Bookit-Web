// signup.js
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import config from './config';

const handleSignup = (signupData) => {
  const { username, email, password } = signupData;
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      alert("Registration successfully!!");

      const data = { username, email };
      return fetch(`${config.baseURL}/signupsellers.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(response => response.text())
        .catch(error => {
          console.error('Error:', error);
          throw error;
        });
    })
    .catch((error) => {
      console.log(error.message);
      alert(error.message);
      throw error;
    });
};

export default handleSignup;
