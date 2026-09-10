function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-lg bg-indigo-500 px-5 py-3 font-semibold text-white hover:bg-indigo-600"
    >
      {children}
    </button>
  );
}

export default Button;