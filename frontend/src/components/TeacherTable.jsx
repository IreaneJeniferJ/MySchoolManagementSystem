import DeleteIcon from "../assets/delete-icon.png";
import EditIcon from "../assets/edit-icon.png";
export default function TeacherTable({ teachers, onEdit, onDelete }) {
  return (
    <table className="table-auto w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">S.NO</th>
          <th className="border px-4 py-2">Staff ID</th>
          <th className="border px-4 py-2">Register Date</th>
          <th className="border px-4 py-2">Staff Name</th>
          <th className="border px-4 py-2">Class</th>
          <th className="border px-4 py-2">Working Role</th>
          <th className="border px-4 py-2">Mobile Number</th>
          <th className="border px-4 py-2">Address</th>
          <th className="border px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {teachers.length === 0 ? (
          <tr>
            <td colSpan="9" className="text-center py-4">
              No teachers found.
            </td>
          </tr>
        ) : (
          teachers.map((teacher, index) => (
            <tr key={teacher._id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{teacher.staffId}</td>
              <td className="border px-4 py-2">
                {new Date(teacher.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{teacher.staffName}</td>
              <td className="border px-4 py-2">{teacher.class || "--"}</td>
              <td className="border px-4 py-2">
                {teacher.workingRole?.staffRole || "—"}
              </td>
              <td className="border px-4 py-2">{teacher.mobileNumber}</td>
              <td className="border px-4 py-2">{teacher.address}</td>
              <td className="border px-4 py-2 flex justify-center">
                <button
                  className="px-1 py-1 rounded-sm cursor-pointer"
                  onClick={() => onEdit(teacher)}
                >
                  <img src={EditIcon} alt="Edit" className="w-5 h-5" />
                </button>
                <button
                  className="px-1 py-1 rounded-sm cursor-pointer"
                  onClick={() => onDelete(teacher._id)}
                >
                  <img src={DeleteIcon} alt="Delete" className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
