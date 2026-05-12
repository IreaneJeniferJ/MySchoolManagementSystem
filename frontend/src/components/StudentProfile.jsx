import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/student/${id}`)
      .then((res) => 
        {console.log("Student object:", res.data);setStudent(res.data)})
      .catch(() => {
        alert("Student not found");
        navigate(-1);
      });
  }, [id, navigate]);

  if (!student) return <div className="p-4">Loading...</div>;

  const Detail = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
      <span className="sm:w-40 font-medium text-gray-700">{label}</span>
      <span className="hidden sm:inline-block">:</span>
      <span className="text-gray-900 break-words">{value || "-"}</span>
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <button
        className="bg-cyan-600 text-white px-4 py-2 rounded mb-6"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col md:flex-row gap-6 md:gap-10">
        
        <div className="flex justify-center md:justify-start">
          <img
  src={student.profilePicture ? `http://localhost:5000/uploads/${student.profilePicture}` : "/default.jpg"}
  alt="Profile"
  className="w-32 sm:w-40 md:w-48 h-auto object-cover rounded-lg border shadow"
/>

        </div>

        
        <div className="w-full flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Detail label="Student Name" value={student.studentName} />
              <Detail label="Student ID" value={student.studentId} />
              <Detail label="Standard" value={student.standard?.standard || 'N/A'} />
              <Detail label="Parent Name" value={student.parentName} />
              <Detail label="Phone Number" value={student.mobileNumber} />
              <Detail label="Alternate Phone" value={student.alternateMobileNumber} />
            </div>

            <div className="flex flex-col gap-3">
              <Detail label="Address" value={student.address} />
              <Detail label="Landmark" value={student.landmark} />
              <Detail label="City" value={student.city} />
              <Detail label="State" value={student.state} />
              <Detail label="Country" value={student.country} />
              <Detail label="Date Joined" value={student.createdAt?.split("T")[0]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
