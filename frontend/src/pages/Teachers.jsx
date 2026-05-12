import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TeacherTable from "../components/TeacherTable";

const Teachers = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [roles, setRoles] = useState([]);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/staff?page=${currentPage}&limit=${entriesPerPage}&search=${searchQuery}`
      );
      setTeachers(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.totalCount);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setTeachers([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/staffRole");
      setRoles(res.data.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchRoles();
  }, [entriesPerPage, currentPage, searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`http://localhost:5000/staff/delete/${id}`);
        fetchTeachers();
      } catch (err) {
        console.error("Failed to delete teacher:", err);
      }
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
  };

  const handleModalChange = (field, value) => {
    setEditingTeacher((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/staff/update/${editingTeacher._id}`,
        {
          class: editingTeacher.class,
          workingRole:
            editingTeacher.workingRole._id || editingTeacher.workingRole,
          mobileNumber: editingTeacher.mobileNumber,
          address: editingTeacher.address,
        }
      );
      setEditingTeacher(null);
      fetchTeachers();
    } catch (err) {
      console.error("Failed to update teacher:", err);
    }
  };

  return (
    <section>
      <div className="flex justify-between mb-5">
        <form className="flex gap-3 items-center">
          <label htmlFor="entries">Show</label>
          <select
            className="border border-solid px-1"
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <label>Entries</label>
        </form>

        <section className="flex justify-around gap-3 items-center">
          <input
            className="border border-gray-300 px-1"
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link
            className="border border-solid bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded-sm text-white"
            to="/AddTeacher"
          >
            Add Teacher
          </Link>
        </section>
      </div>

      <TeacherTable
        teachers={teachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {editingTeacher && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40">
          <div className="bg-white p-5 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Teacher</h2>

            <label className="block mb-2">Class</label>
            <input
              className="w-full p-2 border mb-3"
              type="text"
              value={editingTeacher.class || ""}
              onChange={(e) => handleModalChange("class", e.target.value)}
            />

            <label className="block mb-2">Working Role</label>
            <select
              className="w-full p-2 border mb-3"
              value={
                editingTeacher.workingRole._id || editingTeacher.workingRole
              }
              onChange={(e) => handleModalChange("workingRole", e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.staffRole}
                </option>
              ))}
            </select>

            <label className="block mb-2">Mobile Number</label>
            <input
              type="text"
              maxLength="10"
              minLength="10"
              pattern="\d{10}"
              required
              value={editingTeacher.mobileNumber}
              onChange={(e) =>
                handleModalChange("mobileNumber", e.target.value)
              }
              className="w-full p-2 border mb-3"
            />

            <label className="block mb-2">Address</label>
            <input
              className="w-full p-2 border mb-3"
              type="text"
              value={editingTeacher.address}
              onChange={(e) => handleModalChange("address", e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                onClick={() => setEditingTeacher(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                onClick={handleModalSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="flex justify-between mt-5">
        <section>
          {teachers.length === 0
            ? "No entries"
            : `Showing ${Math.min((currentPage - 1) * entriesPerPage + 1, totalCount)} to ${Math.min(currentPage * entriesPerPage, totalCount)} of ${totalCount} entries`}
        </section>
        <nav>
          <ul className="flex gap-2">
            <li>
              <button
                className="border px-2 py-1 rounded-sm  border-gray-500  text-gray-500 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i}>
                <button
                  className={`border px-2 py-1 rounded-sm ${currentPage === i + 1 ? "bg-blue-500" : "bg-gray-400 hover:bg-gray-500"} text-white`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                className="border px-2 py-1 rounded-sm  border-gray-500  text-gray-500 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </footer>
    </section>
  );
};

export default Teachers;
