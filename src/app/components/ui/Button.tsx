import Link from "next/link";
import { buttonClass } from "./buttonStyles";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = SharedProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkButtonProps = SharedProps & {
  href: string;
  onClick?: () => void;
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: ButtonProps | LinkButtonProps) {
  const classes = buttonClass(variant, size, className);

  if (href) {
    const { onClick } = props as LinkButtonProps;
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
