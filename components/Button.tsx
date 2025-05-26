import { twMerge } from "tailwind-merge";
import React, { forwardRef } from "react";

const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({className, children, disabled, type = 'button', ...props}, ref) => {
  return (
    <button
      type={type}
      ref={ref}
      disabled={disabled}
      {...props}
      className={twMerge(
        'w-full rounded-full bg-green-500 border border-transparent px-3 py-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition',
        className
      )}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
