export default function ToolButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
        isActive
          ? 'bg-indigo-100 text-indigo-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      title={label}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  )
}