import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validErrors, setValidErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const { closeModal } = useModal();

  useEffect(() => {
    const signUpErrors = {}

    if (!email.includes("@")) signUpErrors.invalidEmail = "Please provide a valid email."
    if (password.length < 6) signUpErrors.passwordLength = "Please enter a valid password that is at least 6 characters";
    if (password !== confirmPassword) signUpErrors.matchPasswords = "Please make sure both passwords match."
    if (firstName.length < 2) signUpErrors.firstName = "Please enter a valid first name that is at least 2 letters"
    if (lastName.length < 2) signUpErrors.lastName = "Please enter a valid last name that is at least 2 letters"
    if (username.length < 4) signUpErrors.userNameLength = "Please enter a valid Username that is at least 4 letters"
    if (username.length > 4 && username.includes("@")) signUpErrors.invalidUserName = "Please enter a valid Username (cannot include @ symbol)"

    setValidErrors(signUpErrors);

  }, [firstName, lastName, username, email, password, confirmPassword])

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(validErrors).length > 0) {
      setShowErrors(true);
    }

    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  console.log(errors);

  return (
    <div className='signUpModal'>
      <section className='wholeSignUp'>
        <form style={{ overflowY: "auto" }} className='loginForm' onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          <label>
            <input
              type="text"
              className='input'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {showErrors && <p className='errorText'>{validErrors.invalidEmail}</p>}
          <label>
            <input
              type="text"
              className='input'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          {showErrors && <p className='errorText'>{validErrors.invalidUserName} {" "} {validErrors.userNameLength}</p>}
          <label>
            <input
              type="text"
              className='input'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>
          {showErrors && <p className='errorText'>{validErrors.firstName}</p>}
          <label>
            <input
              type="text"
              className='input'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          {showErrors && <p className='errorText'>{validErrors.lastName}</p>}
          <label>
            <input
              type="password"
              className='input'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {showErrors && <p className='errorText'>{validErrors.passwordLength}</p>}
          <label>
            <input
              type="password"
              className='input'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          {showErrors && <p className='errorText'>{validErrors.matchPasswords}</p>}
          <button className='loginButton' disabled={firstName.length > 0 && lastName.length > 0 && username.length > 0 && password.length > 0 && email.length > 0 && confirmPassword.length > 0 ? false : true} type="submit">Sign Up</button>
        </form>
      </section>
    </div>
  );
}

export default SignupFormModal;
