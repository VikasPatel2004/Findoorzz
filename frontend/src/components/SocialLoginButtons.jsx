import React from 'react';
import { GoogleLogin } from '@react-oauth/google';



export default function SocialLoginButtons({ onLoginSuccess, onLoginFailure }) {
  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login success:', credentialResponse);
    if (onLoginSuccess) {
      onLoginSuccess('google', credentialResponse);
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google login failure');
    if (onLoginFailure) {
      onLoginFailure('google', { error: 'Google login failed' });
    }
  };

  return (
    <div className="flex space-x-4 justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
        useOneTap
      />
    </div>
  );
}
