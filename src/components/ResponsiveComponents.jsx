// Common responsive form components
import React from 'react';

export function FormField({ label, type = 'text', value, onChange, placeholder, disabled = false, options = [], className = '', required = false }) {
  const baseInputClasses = `
    w-full px-3 lg:px-4 py-2.5 lg:py-3 
    bg-white/10 border border-white/20 rounded-lg lg:rounded-xl 
    text-white placeholder-gray-400 
    focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 
    transition-all duration-200
    text-sm lg:text-base
    disabled:opacity-60 disabled:cursor-not-allowed
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm lg:text-base font-semibold text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={baseInputClasses}
        >
          {options.map(({ value: optValue, label: optLabel }) => (
            <option key={optValue} value={optValue} className="bg-gray-800 text-white">
              {optLabel}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={4}
          className={`${baseInputClasses} resize-vertical min-h-[100px]`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={baseInputClasses}
        />
      )}
    </div>
  );
}

export function ResponsiveButton({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false, 
  className = '',
  fullWidth = false
}) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 
    font-semibold transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-60 disabled:cursor-not-allowed
    touch-manipulation
  `;

  const sizeClasses = {
    small: 'px-3 lg:px-4 py-2 text-xs lg:text-sm rounded-md lg:rounded-lg',
    medium: 'px-4 lg:px-6 py-2.5 lg:py-3 text-sm lg:text-base rounded-lg lg:rounded-xl',
    large: 'px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg rounded-xl lg:rounded-2xl'
  };

  const variantClasses = {
    primary: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-700/30 focus:ring-red-500',
    secondary: 'border-2 border-red-500 text-red-300 hover:bg-red-500/10 focus:ring-red-500',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/5 focus:ring-gray-500',
    danger: 'bg-red-700 hover:bg-red-600 text-white focus:ring-red-600'
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`}
    >
      {children}
    </button>
  );
}

export function ResponsiveContainer({ children, className = '', maxWidth = '7xl' }) {
  const maxWidthClasses = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  };

  return (
    <div className={`container-responsive ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}

export function ResponsiveGrid({ children, cols = { sm: 1, md: 2, lg: 3 }, gap = 'md', className = '' }) {
  const gapClasses = {
    sm: 'gap-3 lg:gap-4',
    md: 'gap-4 lg:gap-6',
    lg: 'gap-6 lg:gap-8'
  };

  const gridClasses = `grid grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} ${gapClasses[gap]}`;

  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
}

export function ResponsiveCard({ children, className = '', padding = 'md' }) {
  const paddingClasses = {
    sm: 'p-3 lg:p-4',
    md: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8'
  };

  return (
    <div className={`
      bg-white/5 backdrop-blur-sm border border-white/10 
      rounded-xl lg:rounded-2xl shadow-2xl 
      hover:bg-white/10 transition-all duration-300
      ${paddingClasses[padding]} ${className}
    `}>
      {children}
    </div>
  );
}
