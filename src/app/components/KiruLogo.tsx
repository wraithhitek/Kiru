export function KiruLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <img 
      src="/kiru-logo.png" 
      alt="Kiru Logo" 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
