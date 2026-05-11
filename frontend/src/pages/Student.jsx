import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import StudentTable from "../components/StudentTable";
import EditStudentModal from "../components/EditStudentModal";

const Student = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [editingStudent, setEditingStudent] = useState(null);

  const handleEdit = (student) => setEditingStudent(student);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/student/delete/${id}`);
        refreshStudents();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete student.");
      }
    }
  };

  const handleCloseModal = () => setEditingStudent(null);
  const refreshStudents = () => {
    axios
      .get("http://localhost:5000/student")
      .then((res) => setStudents(res.data.data));
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/student");
        setStudents(res.data.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, []);

  const totalPages = Math.ceil(students.length / entriesPerPage) || 1;
  const indexOfLastStudent = currentPage * entriesPerPage;
  const indexOfFirstStudent = indexOfLastStudent - entriesPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <section>
      <div className="flex justify-between mb-5">
        <form className="flex gap-3 items-center">
          <label htmlFor="entries">Show</label>
          <select
            className="border border-solid px-1"
            name="entries"
            id="entries"
            value={entriesPerPage}
            onChange={handleEntriesChange}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <label htmlFor="entries">Entries</label>
        </form>

        <section className="flex justify-around gap-3 items-center">
          <input
            className="border border-gray-300 px-1"
            type="text"
            placeholder="Search here"
            id="searchData"
          />
          <Link
            className="border border-solid bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded-sm text-white"
            to="/AddStudent"
          >
            Add Student
          </Link>
        </section>
      </div>

      <StudentTable
        students={currentStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(student) => navigate(`/student/${student.studentId}`)}
        indexOfFirstStudent={indexOfFirstStudent}
      />
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={handleCloseModal}
          onUpdate={refreshStudents}
        />
      )}
      <footer className="flex justify-between mt-5">
        <section>
          {students.length === 0
            ? "No entries"
            : `Showing ${indexOfFirstStudent + 1} to ${Math.min(indexOfLastStudent, students.length)} of ${students.length} entries`}
        </section>

        <nav>
          <ul className="flex gap-2">
            <li>
              <button
                className="border border-solid px-2 py-1 rounded-sm border-gray-500  text-gray-500 disabled:opacity-50"
                onClick={handlePrevious}
                disabled={currentPage === 1 || students.length === 0}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li key={i + 1}>
                <button
                  className={`border border-solid px-2 py-1 rounded-sm ${
                    currentPage === i + 1
                      ? "bg-blue-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  } text-white`}
                  onClick={() => handlePageChange(i + 1)}
                  disabled={students.length === 0}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                className="border border-solid px-2 py-1 rounded-sm border-gray-500  text-gray-500 disabled:opacity-50"
                onClick={handleNext}
                disabled={currentPage === totalPages || students.length === 0}
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

export default Student;
