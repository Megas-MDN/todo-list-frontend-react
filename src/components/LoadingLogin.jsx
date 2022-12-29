import React from 'react';
import './LoadingLogin.css';

function LoadingLogin() {
  return (
    <div className='loader'>
      <div className='face'>
        <div className='circle'></div>
      </div>
      <div className='face'>
        <div className='circle'></div>
      </div>
    </div>
  );
}

export default LoadingLogin;
