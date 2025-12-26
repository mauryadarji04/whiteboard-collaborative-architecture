import { usePresenceStore } from '../../store/presenceStore'

export default function UsersPanel() {
  const users = usePresenceStore((state) => state.users)

  return (
    <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 z-10 min-w-[200px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Online Users</h3>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
          {users.length}
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No users online
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: user.color }}
              />
              <span className="text-sm text-gray-700 font-medium truncate">
                {user.name}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}