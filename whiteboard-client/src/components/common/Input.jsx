export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${className}`}
      {...props}
    />
  )
}