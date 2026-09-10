function Input({ label, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-200">
          {label}
        </label>
      )}

      <input
        className={`w-full rounded-lg border bg-slate-950 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500 ${
          error ? "border-red-500" : "border-slate-700"
        } ${className}`}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default Input;
