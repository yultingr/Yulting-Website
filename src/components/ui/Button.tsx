import { type ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:opacity-80",
  secondary:
    "border border-border text-foreground hover:bg-muted",
  ghost:
    "text-foreground hover:bg-muted",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-sm",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
}

interface ButtonAnchorProps extends ComponentProps<"a"> {
  variant?: Variant;
  size?: Size;
}

export function ButtonAnchor({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonAnchorProps) {
  return (
    <a
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
}
