import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useToast } from '../context/ToastContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [currentState, setCurrentState] = useState('Login');
    const navigate = useNavigate();
    const { showToast } = useToast();

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleGoogleLoginSuccess = (credentialResponse) => {
        try {
            if (!credentialResponse.credential) {
                console.error('❌ No credential received from Google');
                showToast('Google login failed. No credentials.', 'error');
                return;
            }

            const decodedToken = jwtDecode(credentialResponse.credential);
            console.log('Google Login Response:', {
                email: decodedToken.email,
                name: decodedToken.name
            });
            
            fetch('http://localhost:4000/api/auth/google-login', { 
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify({ googleToken: credentialResponse.credential }),
            })
              .then(response => {
                console.log('Response status:', response.status);
                
                // Handle non-200 responses
                if (!response.ok) {
                  return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Login failed');
                  });
                }
                
                return response.json();
              })
              .then(data => {
                console.log('Server response:', data);
                if (data.success) {
                  // Store both token and user info
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('user', JSON.stringify(data.user));
                  showToast('Welcome back!', 'success');
                  navigate('/'); 
                } else {
                  throw new Error(data.error || 'Login failed');
                }
              })
              .catch(error => {
                console.error('Google Login Error:', error);
                showToast(`Login failed: ${error.message}`, 'error');
              });
        } catch (decodeError) {
            console.error('Token Decode Error:', decodeError);
            showToast('Error processing Google token', 'error');
        }
    };

    const handleGoogleLoginFailure = (errorResponse) => {
        console.error('Google Login Failed:', {
          error: errorResponse.error,
          details: errorResponse.details
        });
        
        showToast('Google login failed. Please try again.', 'error');
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        const body = currentState === 'Login'
            ? { email, password }  
            : { name, email, password };  

        try {
            const endpoint = currentState === 'Login'
                ? 'http://localhost:4000/api/auth/login'  
                : 'http://localhost:4000/api/auth/signup'; 

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            
            const data = await response.json();

            if (!response.ok) {
                showToast('Invalid email or password', 'error');
            } else {
                localStorage.setItem('token', data.token);  
                showToast(
                    currentState === 'Login' 
                        ? 'Welcome back to your design sanctuary' 
                        : 'Your creative journey begins here',
                    'success'
                );
                navigate('/'); 
            }
        } catch (error) {
            showToast('Connection error', 'error');
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState === 'Login' ? 'Login' : 'Sign Up'}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            
            {currentState === 'Sign Up' && (
                <input 
                    type="text" 
                    className='w-full px-3 py-2 border border-gray-800' 
                    placeholder='Name' 
                    value={name}
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
            )}
            
            <input 
                type="email" 
                className='w-full px-3 py-2 border border-gray-800' 
                placeholder='Email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            
            <input 
                type="password" 
                className='w-full px-3 py-2 border border-gray-800' 
                placeholder='Password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            
            <button type="submit" className='w-full bg-gray-800 text-white py-2'>
                {currentState === 'Login' ? 'Login' : 'Sign Up'}
            </button>

            <div className="w-full text-center my-2">
                <span className="text-gray-500">or</span>
            </div>

            <div className="w-full">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginFailure}
                    useOneTap
                    client_id={clientId}  
                />
            </div>

            <p className='text-sm mt-4'>
                {currentState === 'Login' 
                    ? "Don't have an account? " 
                    : "Already have an account? "}
                <button 
                    type="button"
                    className='text-gray-800 underline'
                    onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
                >
                    {currentState === 'Login' ? 'Sign Up' : 'Login'}
                </button>
            </p>
        </form>
    );
}

export default Login;