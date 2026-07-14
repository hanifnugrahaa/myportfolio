import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  ...props
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(-gradientSize);
  const [mouseY, setMouseY] = useState(-gradientSize);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (cardRef.current) {
        const { left, top } = cardRef.current.getBoundingClientRect();
        setMouseX(e.clientX - left);
        setMouseY(e.clientY - top);
      }
    }

    const card = cardRef.current;
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
      return () => {
        card.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative flex size-full overflow-hidden rounded-xl bg-neutral-900 border border-white/10 text-white",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 w-full">{children}</div>
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={
          {
            background: `radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)`,
            opacity: gradientOpacity,
          } as CSSProperties
        }
      />
    </div>
  );
}
