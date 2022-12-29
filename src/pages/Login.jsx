import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer, toast } from 'react-toastify';

import axios from 'axios';
import LoadingLogin from '../components/LoadingLogin';

function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [pass, setPass] = useState('');
  const [disabledBtn, setDisableBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const reg = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (reg.test(email) && pass.length > 6) {
      setDisableBtn(false);
    } else {
      !disabledBtn && setDisableBtn(true);
    }
  }, [email, pass]);

  const handleClick = async () => {
    if (!email || !pass) {
      // handleErrors(`${!email ? 'Email' : 'Password'} is required`);
      return;
    }
    setDisableBtn(true);
    try {
      setLoading(true);
      const { data } = await axios.post(
        'https://api-todo-list-glnl.onrender.com/login',
        {
          email,
          password: pass,
        }
      );
      console.log(data);
      localStorage.setItem('token', JSON.stringify({ token: data?.token }));
      navigate('/');
    } catch (err) {
      localStorage.clear();
      setDisableBtn(false);
      console.log('Erro to login', err);
      setError(true);
      // handleErrors('Login inválido');
    } finally {
      setEmail('');
      setPass('');
      setLoading(false);
    }
  };
  return (
    <div className='container'>
      <h2 className='text-3xl font-bold'>Login</h2>
      <form className='form'>
        <label htmlFor='email'>
          Email
          <input
            type='email'
            id='email'
            name='email'
            placeholder='E-mail'
            autoComplete='off'
            value={email}
            onChange={({ target: { value } }) => {
              if (error) {
                setError(false);
              }
              setEmail(value);
            }}
          />
        </label>
        <label htmlFor='password'>
          Senha
          <input
            style={{
              color: ` ${
                pass.length < 5 && pass.length > 0
                  ? 'red'
                  : pass.length < 7
                  ? 'yellow'
                  : 'green'
              }`,
            }}
            type='password'
            id='password'
            name='password'
            autoComplete='off'
            placeholder='Password'
            value={pass}
            onChange={({ target: { value } }) => setPass(value)}
          />
        </label>
        {!loading ? (
          <button
            style={{ background: `${error ? 'red' : 'rgb(80, 98, 255)'}` }}
            type='button'
            onClick={handleClick}
            disabled={disabledBtn}
          >
            {error ? 'Invalid login' : 'Submit'}
          </button>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LoadingLogin />
          </div>
        )}
      </form>
      {/* <ToastContainer /> */}
      {/* <span>
        Don't have an account? <Link to={'/register'}>click here</Link>
      </span> */}
    </div>
  );
}

export default Login;
