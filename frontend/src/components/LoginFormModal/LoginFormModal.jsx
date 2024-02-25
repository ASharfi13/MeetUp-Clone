import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = async () => {
    setCredential('DemoUser1');
    setPassword('password');

    try {
      await dispatch(sessionActions.login({ credential: 'DemoUser1', password: 'password' }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <>
      <section className='wholeLogin'>
        <form className='loginForm' onSubmit={handleSubmit}>
          <h1>Log In</h1>
          <input
            className='input'
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
          <input
            className='input'
            type="password"
            value={password}
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className='demoUserLink' onClick={handleDemoLogin}>
            Log In As Demo User
          </p>
          {errors.credential && <p className='errorText'>{errors.credential}</p>}
          <button disabled={credential.length >= 4 && password.length >= 6 ? false : true} className='loginButton' type="submit">Log In</button>
        </form>
      </section>
    </>
  );
}

export default LoginFormModal;
