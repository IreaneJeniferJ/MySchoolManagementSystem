import DeleteIcon from "../assets/delete-icon.png";
import EditIcon from "../assets/edit-icon.png";
export default function StudentStandardTable({
  standards = [],
  onEdit,
  onDelete,
}) {
  const formatStandard = (value) => {
    if (typeof value === "number") {
      const lastDigit = value % 10;
      const lastTwoDigits = value % 100;
      if (lastDigit === 1 && lastTwoDigits !== 11) return `${value}st`;
      if (lastDigit === 2 && lastTwoDigits !== 12) return `${value}nd`;
      if (lastDigit === 3 && lastTwoDigits !== 13) return `${value}rd`;
      return `${value}th`;
    }
    return value;
  };

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">S.NO</th>
            <th className="border px-4 py-2 text-center">Standard</th>
            <th className="border px-4 py-2 text-center">Status</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {standards.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No standards found.
              </td>
            </tr>
          ) : (
            standards.map((standard, index) => (
              <tr key={standard._id} className="text-center">
                <td className="border px-4 py-2 align-middle">{index + 1}</td>
                <td className="border px-4 py-2 align-middle">
                  {formatStandard(standard.standard)}
                </td>
                <td className="border px-4 py-2 align-middle capitalize">
                  {standard.status === "Active" ? (
                    <span className="text-green-600 font-semibold">
                      🟢 Active
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      🔴 Inactive
                    </span>
                  )}
                </td>
                <td className="border px-4 py-2 align-middle">
                  <div className="flex justify-center">
                    <button
                      className="px-1 py-1 rounded-sm cursor-pointer"
                      onClick={() => onEdit(standard)}
                    >
                      <img src={EditIcon} alt="Edit" className="w-5 h-5" />
                    </button>
                    <button
                      className="px-1 py-1 rounded-sm cursor-pointer"
                      onClick={() => onDelete(standard._id)}
                    >
                      <img src={DeleteIcon} alt="Delete" className="w-5 h-5" />
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
