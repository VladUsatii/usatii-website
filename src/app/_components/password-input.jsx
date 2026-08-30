'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ className = '', buttonClassName = '', containerClassName = '', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${containerClassName}`}>
      <input {...props} type={visible ? 'text' : 'password'} className={`${className} pr-12`} />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className={`absolute inset-y-0 right-0 grid w-12 place-items-center transition ${buttonClassName}`}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
