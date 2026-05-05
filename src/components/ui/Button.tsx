import { HTMLMotionProps, motion } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const baseClasses =
  'inline-flex items-center justify-center rounded-2xl font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[#0099CC] text-white shadow-[0_10px_25px_rgba(0,153,204,0.22)] hover:bg-[#007299]',
  secondary: 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'min-h-11 px-4 text-sm',
  md: 'min-h-11 px-6 text-base',
  lg: 'min-h-14 px-8 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.18 }}
      type={type}
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    />
  );
}
