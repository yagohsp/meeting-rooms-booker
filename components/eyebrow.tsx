export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium tracking-[0.2em] text-brand-accent uppercase">
      {children}
    </p>
  );
}
