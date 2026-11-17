import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';
import { CountUp } from './CountUp';

/* =========================================================================
   BUTTON
   Exact Shapes: 10px radius (rounded-[10px])
   Primary: Soft Fresh Green #2E7D4E (hover #24663F, active scale 0.975)
   Secondary: White #FFFFFF with subtle border #E2E8E0
   Blue: Soft Blue #4B749F
   Loading: preserves width without jumping
   ========================================================================= */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'blue' | 'outline' | 'ghost' | 'destructive' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-[#2E7D4E] hover:bg-[#24663F] active:bg-[#1B4D2F] text-white shadow-xs border border-[#2E7D4E]/30 hover:-translate-y-px hover:shadow-sm',
      secondary:
        'bg-white hover:bg-[#EBF5EE] active:bg-[#E2E8E0] text-[#2E7D4E] border border-[#2E7D4E]/40 hover:border-[#2E7D4E] shadow-2xs hover:-translate-y-px',
      blue:
        'bg-[#4B749F] hover:bg-[#3A5D80] active:bg-[#4E76AE] text-white shadow-xs border border-[#4B749F]/30 hover:-translate-y-px hover:shadow-sm',
      outline:
        'bg-transparent hover:bg-[#EBF5EE] active:bg-[#E2E8E0] text-[#2E7D4E] border border-[#2E7D4E]/40 hover:border-[#2E7D4E] hover:-translate-y-px',
      ghost:
        'bg-transparent hover:bg-[#EBF5EE] active:bg-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E] border border-transparent',
      destructive:
        'bg-[#D96B6B] hover:bg-[#C55757] active:bg-[#B04343] text-white shadow-xs border border-transparent hover:-translate-y-px',
      teal:
        'bg-[#2E7D4E] hover:bg-[#24663F] active:bg-[#1B4D2F] text-white shadow-xs border border-[#2E7D4E]/30 hover:-translate-y-px',
    };

    const sizes = {
      sm: 'text-xs font-semibold px-3.5 py-1.5 rounded-[10px] gap-1.5 min-h-[36px]',
      md: 'text-sm font-semibold px-4.5 py-2 rounded-[10px] gap-2 min-h-[40px]',
      lg: 'text-base font-semibold px-6 py-2.5 rounded-[10px] gap-2.5 min-h-[46px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-180 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D4E] focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.975]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-current shrink-0" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon}
            <span>{children}</span>
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

/* =========================================================================
   BADGE
   Pill shaped strictly for status/verified/urgent tags
   ========================================================================= */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'blue' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline' | 'teal' | 'urgent';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({ children, variant = 'primary', size = 'md', dot = false, className, ...props }: BadgeProps) {
  const variantStyles = {
    primary: 'bg-[#EBF5EE] text-[#1B4D2F] border-[#C6E6CD]',
    secondary: 'bg-[#FEF9ED] text-[#966F1C] border-[#F7E5BC]',
    blue: 'bg-[#EEF3F8] text-[#2E4864] border-[#D1E1F3]',
    success: 'bg-[#EBF5EE] text-[#1B4D2F] border-[#C6E6CD]',
    warning: 'bg-[#FEF9ED] text-[#966F1C] border-[#F7E5BC]',
    danger: 'bg-[#FDF3F3] text-[#B04343] border-[#F9D0D0]',
    neutral: 'bg-[#F8FAF8] text-[#4E5C53] border-[#E2E8E0]',
    outline: 'bg-white text-[#4E5C53] border-[#E2E8E0]',
    teal: 'bg-[#EBF5EE] text-[#1B4D2F] border-[#C6E6CD]',
    urgent: 'bg-[#FEF9ED] text-[#966F1C] border-[#D8A94D]/50 font-bold',
  };

  const dotColors = {
    primary: 'bg-[#2E7D4E]',
    secondary: 'bg-[#D8A94D]',
    blue: 'bg-[#4B749F]',
    success: 'bg-[#2E7D4E]',
    warning: 'bg-[#D8A94D]',
    danger: 'bg-[#D96B6B]',
    neutral: 'bg-[#7E8C82]',
    outline: 'bg-[#7E8C82]',
    teal: 'bg-[#2E7D4E]',
    urgent: 'bg-[#D8A94D]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full',
    md: 'text-xs px-3 py-1 rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border select-none tracking-tight',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}

/* =========================================================================
   PROGRESS BAR (With smooth 900-1200ms cubic-bezier transition)
   ========================================================================= */
export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  color?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  color = 'bg-[#2E7D4E]',
  showPercent = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs font-medium text-[#4E5C53]">
          <span className="font-semibold text-[#18261E]">{label}</span>
          {showPercent && <span className="font-semibold text-[#18261E]">{percent}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-[#E2E8E0]/70 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full', color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* =========================================================================
   STAT CARD (with CountUp and micro-lift)
   ========================================================================= */
export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  badge?: string;
  animateCount?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive,
  badge,
  animateCount = true,
  className,
}: StatCardProps) {
  const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10);
  const isParsable = animateCount && !isNaN(numericValue) && numericValue > 0;
  const suffix = typeof value === 'string' ? value.replace(/[0-9]/g, '').trim() : '';

  return (
    <div
      className={cn(
        'bg-white p-5 rounded-[16px] border border-[#E2E8E0] shadow-xs flex flex-col justify-between card-interactive',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#4E5C53]">{title}</span>
        {badge ? (
          <Badge variant="success" size="sm">
            {badge}
          </Badge>
        ) : (
          icon && (
            <div className="w-9 h-9 rounded-[10px] bg-[#EBF5EE] border border-[#C6E6CD] text-[#2E7D4E] flex items-center justify-center transition-colors group-hover:bg-[#E2E8E0]">
              {icon}
            </div>
          )
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18261E]">
            {isParsable ? (
              <CountUp end={numericValue} suffix={suffix ? ` ${suffix}` : ''} />
            ) : (
              value
            )}
          </span>
          {trend && (
            <span
              className={cn(
                'text-xs font-semibold px-1.5 py-0.5 rounded-[6px]',
                trendPositive ? 'bg-[#EBF5EE] text-[#1B4D2F]' : 'bg-[#F8FAF8] text-[#4E5C53]'
              )}
            >
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-[#4E5C53] font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}

/* =========================================================================
   CARD STRUCTURE
   ========================================================================= */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white rounded-[16px] border border-[#E2E8E0] shadow-xs card-interactive',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-4 space-y-1.5', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-bold text-[#18261E] tracking-tight', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-[#4E5C53] font-medium leading-relaxed', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-6 pt-4 border-t border-[#E2E8E0] flex items-center justify-between', className)}
      {...props}
    />
  );
}

/* =========================================================================
   ALERT
   ========================================================================= */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  icon?: React.ReactNode;
}

export function Alert({ variant = 'info', title, icon, children, className, ...props }: AlertProps) {
  const styles = {
    info: 'bg-[#EEF3F8] border-[#D1E1F3] text-[#18261E]',
    success: 'bg-[#EBF5EE] border-[#C6E6CD] text-[#18261E]',
    warning: 'bg-[#FEF9ED] border-[#F7E5BC] text-[#18261E]',
    danger: 'bg-[#FDF3F3] border-[#F9D0D0] text-[#18261E]',
  };

  return (
    <div
      className={cn('p-4 rounded-[12px] border flex items-start gap-3 text-sm leading-relaxed', styles[variant], className)}
      {...props}
    >
      {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
      <div className="space-y-1">
        {title && <h5 className="font-bold text-xs uppercase tracking-wider text-[#18261E]">{title}</h5>}
        <div className="text-xs text-[#4E5C53]">{children}</div>
      </div>
    </div>
  );
}

/* =========================================================================
   EMPTY STATE (Polished with Friendly Icon & Clear Action)
   ========================================================================= */
export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-white border border-dashed border-[#E2E8E0] rounded-[16px] p-10 text-center flex flex-col items-center justify-center space-y-3 shadow-2xs animate-fade-in',
        className
      )}
    >
      <div className="w-12 h-12 rounded-[12px] bg-[#EBF5EE] border border-[#C6E6CD] text-[#2E7D4E] flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-base font-bold text-[#18261E] tracking-tight">{title}</h4>
      <p className="text-xs text-[#4E5C53] max-w-sm leading-relaxed">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

/* =========================================================================
   SKELETON LOADER (Light Warm Grey Shimmer)
   ========================================================================= */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton-shimmer h-4 w-full', className)} {...props} />;
}
