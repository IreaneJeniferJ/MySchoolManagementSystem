import DeleteIcon from '../assets/delete-icon.png';
import EditIcon from '../assets/edit-icon.png';
export default function EventLabelTable({ labels = [], onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">S.NO</th>
            <th className="border px-4 py-2 text-center">Event Name</th>
            <th className="border px-4 py-2 text-center">Label Color</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {labels.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">No event labels found.</td>
            </tr>
          ) : (
            labels.map((label, index) => (
              <tr key={label._id} className="text-center">
                <td className="border px-4 py-2 align-middle">{index + 1}</td>
                <td className="border px-4 py-2 align-middle">{label.event}</td>
                <td className="border px-4 py-2 align-middle">
                  <span
                    className="inline-block px-2 py-1 rounded text-white font-medium"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.event}
                  </span>
                </td>
                <td className="border px-4 py-2 align-middle capitalize">
                  {label.status === "Active" ? (
                    <span className="text-green-600 font-semibold">🟢 Active</span>
                  ) : (
                    <span className="text-red-600 font-semibold">🔴 Inactive</span>
                  )}
                </td>
                <td className="border px-4 py-2 align-middle">
                  <div className="flex justify-center">
                    <button
                      className="px-1 py-1 rounded-sm cursor-pointer"
                      onClick={() => onEdit(label)}
                    >
                      <img src={EditIcon} alt="Edit" className="w-5 h-5" />
                    </button>
                    <button
                      className="px-1 py-1 rounded-sm cursor-pointer"
                      onClick={() => onDelete(label._id)}
                    >
                      <img
                          src={DeleteIcon}
                          alt="Delete"
                          className="w-5 h-5"
                        />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
