
export function Card({ children }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}
