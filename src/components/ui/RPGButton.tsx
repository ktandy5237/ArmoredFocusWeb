import { ButtonHTMLAttributes } from 'react';
import { THEME, METALLIC_SHADOW, METALLIC_FONT } from '@/lib/theme';

type Variant = 'primary' | 'action' | 'danger' | 'gold';

interface RPGButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function RPGButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}: RPGButtonProps) {
  let styles = THEME.buttonPrimary;
  if (variant === 'action') styles = THEME.buttonAction;
  if (variant === 'danger') styles = THEME.buttonDanger;
  if (variant === 'gold') styles = THEME.buttonGold;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles} ${METALLIC_SHADOW} ${METALLIC_FONT} px-4 py-2 rounded shadow-md transition-all active:scale-95 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}