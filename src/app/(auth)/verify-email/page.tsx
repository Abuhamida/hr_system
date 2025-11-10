'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user?.email_confirmed_at) {
      setStatus('success');
      setMessage('Your email has been verified successfully!');
    } else {
      setStatus('error');
      setMessage('Please check your email and click the verification link we sent you.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'success' ? (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          ) : status === 'error' ? (
            <AlertCircle className="mx-auto h-16 w-16 text-yellow-500" />
          ) : (
            <Mail className="mx-auto h-16 w-16 text-primary-500" />
          )}
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status === 'success' ? 'Email Verified!' : 'Check Your Email'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {status === 'success' ? (
            <Link
              href="/auth/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Continue to Login
            </Link>
          ) : (
            <>
              <button
                onClick={checkVerificationStatus}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                I've Verified My Email
              </button>
              
              <button
                onClick={async () => {
                  const supabase = createClient();
                  const userRes = await supabase.auth.getUser();
                  const email = userRes.data.user?.email;
                  
                  if (!email) {
                    alert('No email available to resend verification to.');
                    return;
                  }

                  const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email,
                  });
                  
                  if (error) {
                    alert('Error resending email: ' + error.message);
                  } else {
                    alert('Verification email resent!');
                  }
                }}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Resend Verification Email
              </button>
            </>
          )}
          
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}