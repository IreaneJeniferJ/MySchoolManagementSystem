import DeleteIcon from "../assets/delete-icon.png";
import EditIcon from "../assets/edit-icon.png";
import ViewIcon from "../assets/view-icon.png";
export default function StudentTable({
  students,
  onEdit,
  onDelete,
  onView,
  indexOfFirstStudent,
}) {
  return (
    <table className="table-auto w-full border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">S.NO</th>
          <th className="border px-4 py-2">Student ID</th>
          <th className="border px-4 py-2">Register Date</th>
          <th className="border px-4 py-2">Student Name</th>
          <th className="border px-4 py-2">Standard</th>
          <th className="border px-4 py-2">Parent Name</th>
          <th className="border px-4 py-2">Mobile Number</th>
          <th className="border px-4 py-2">Address</th>
          <th className="border px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="9" className="text-center py-4">
              No students found.
            </td>
          </tr>
        ) : (
          students.map((student, index) => (
            <tr key={student._id} className="text-center">
              <td className="border px-4 py-2">
                {indexOfFirstStudent + index + 1}
              </td>
              <td className="border px-4 py-2">{student.studentId}</td>
              <td className="border px-4 py-2">
                {new Date(student.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{student.studentName}</td>
              <td className="border px-4 py-2">
                {student.standard?.standard || "N/A"}
              </td>

              <td className="border px-4 py-2">{student.parentName}</td>
              <td className="border px-4 py-2">{student.mobileNumber}</td>
              <td className="border px-4 py-2">{student.address}</td>
              <td className="border px-4 py-2 flex justify-center">
                <button
                  className="px-2 py-1 rounded-sm cursor-pointer"
                  onClick={() => onView(student)}
                  title="View"
                >
                  <img src={ViewIcon} alt="View" className="w-5 h-5" />
                </button>
                <button
                  className="px-2 py-1 rounded-sm cursor-pointer"
                  onClick={() => onEdit(student)}
                  title="Edit"
                >
                  <img src={EditIcon} alt="Edit" className="w-5 h-5" />
                </button>
                <button
                  className="px-2 py-1 rounded-sm cursor-pointer"
                  onClick={() => onDelete(student._id)}
                  title="Delete"
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
