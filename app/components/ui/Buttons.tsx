import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`btn-primary text-sm focus-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`btn-outline text-sm focus-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}

export function AccentButton({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`btn-accent text-sm focus-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}
