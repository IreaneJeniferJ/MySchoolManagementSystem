import { useState } from 'react';
import axios from 'axios';

export default function EditStudentModal({ student, onClose, onUpdate }) {
  const [form, setForm] = useState({
    studentName: student.studentName,
    parentName: student.parentName,
    mobileNumber: student.mobileNumber,
    address: student.address
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("studentName", form.studentName);
      formData.append("parentName", form.parentName);
      formData.append("mobileNumber", form.mobileNumber);
      formData.append("address", form.address);

      if (profileImage) {
        formData.append("profilePicture", profileImage); 
      }

      await axios.put(`http://localhost:5000/student/updateStudent/${student._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onUpdate();     
      onClose();      
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>

        <h2 className="text-lg font-semibold mb-4">Edit Student Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Student Name</label>
            <input
              type="text"
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Parent Name</label>
            <input
              type="text"
              name="parentName"
              value={form.parentName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {student.profilePicture && (
              <img
                src={`http://localhost:5000/uploads/${student.profilePicture}`}
                alt="Current"
                className="mt-2 w-24 h-24 object-cover border rounded"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
