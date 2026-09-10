function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 p-6 ${
        hover ? "transition-colors hover:border-indigo-500/50" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
