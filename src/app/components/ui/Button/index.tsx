import React from 'react';
import { IconType } from 'react-icons';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconLeft?: IconType;
  iconRight?: IconType;
}

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <button
    {...rest}
    className="flex group text-gray-500 items-center hover:bg-gray-100 transition px-4 border-2 rounded-md"
  >
    {!!rest?.iconLeft && <rest.iconLeft className="w-5 h-5 mr-2" />}
    {children}
    {!!rest?.iconRight && <rest.iconRight className="w-5 h-5 ml-2" />}
  </button>
);

export default Button;
