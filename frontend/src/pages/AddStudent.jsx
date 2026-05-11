import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const navigate = useNavigate();
  const [studentID, setStudentID] = useState("");
  const [studentName, setStudentName] = useState("");
  const [standard, setStandard] = useState("");
  const [standards, setStandards] = useState([]);
  const [parentName, setParentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [alternateMobileNumber, setAlternateMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/student/getAllStandards"
        );
        console.log("Fetched standards:", res.data); 
        setStandards(res.data);
      } catch (err) {
        console.error("Error fetching standards", err);
      }
    };
    fetchStandards();
  }, []);

  useEffect(() => {
    const generateId = async () => {
      if (standard) {
        try {
          const res = await axios.get(
            `http://localhost:5000/student/generateId/${standard}`
          );
          setStudentID(res.data.studentId);
        } catch (err) {
          console.error("Error generating student ID:", err);
        }
      }
    };
    generateId();
  }, [standard]);

  const validateMobile = (number) => /^\d{10}$/.test(number);

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      !validateMobile(mobileNumber) ||
      !validateMobile(alternateMobileNumber)
    ) {
      setToast({
        show: true,
        message: "Mobile numbers must be 10 digits",
        success: false,
      });
      setTimeout(() => setToast({ show: false }), 3000);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("studentId", studentID);
      formData.append("studentName", studentName);
      formData.append("standard", standard);
      formData.append("parentName", parentName);
      formData.append("mobileNumber", mobileNumber);
      formData.append("alternateMobileNumber", alternateMobileNumber);
      formData.append("address", address);
      formData.append("landmark", landmark);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("gender", gender);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await axios.post("http://localhost:5000/student/addStudent", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ show: true, message: "Added Successfully", success: true });
      setTimeout(() => {
        setToast({ show: false });
        navigate("/students");
      }, 2000);
    } catch (error) {
      console.error("Error adding student:", error);
      setToast({
        show: true,
        message: "Failed to Add Student",
        success: false,
      });
      setTimeout(() => setToast({ show: false }), 3000);
    }
  };

  return (
    <section>
      <h1 className="flex justify-center text-2xl text-gray-600">
        Add Student
      </h1>

      <form className="grid grid-cols-1 sm:grid-cols-2" onSubmit={handleSave}>
        <div className="p-2">
          <label htmlFor="studentID">Student Id</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm bg-gray-100"
            type="text"
            id="studentID"
            value={studentID}
            placeholder="Auto-generated"
            readOnly
          />
        </div>

        <div className="p-2">
          <label htmlFor="studentName">Student Name</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="standard">Standard</label>
          <br />
          <select
            id="standard"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            required
          >
            <option value="">Select Standard</option>
            {standards.map((std) => (
              <option key={std._id} value={std._id}>
                {std.standard}
              </option>
            ))}
          </select>
        </div>

        <div className="p-2">
          <label htmlFor="parentName">Parent Name</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            maxLength={10}
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="alternateMobileNumber">Alternate Mobile Number</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            value={alternateMobileNumber}
            onChange={(e) => setAlternateMobileNumber(e.target.value)}
            maxLength={10}
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="gender">Gender</label>
          <br />
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="p-2">
          <label htmlFor="profilePicture">Upload Profile</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
          />
        </div>

        <div className="p-2">
          <label>Address</label>
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="p-2">
          <label>Landmark</label>
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            required
          />
        </div>
        <div className="p-2">
          <label>City</label>
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="p-2">
          <label>State</label>
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <div className="p-2">
          <label>Country</label>
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end col-span-2 mt-5">
          <button
            type="button"
            onClick={() => navigate("/students")}
            className="border px-5 py-2 bg-gray-400 text-white hover:bg-gray-700"
          >
            Back
          </button>
          <button
            type="submit"
            className="border px-5 py-2 bg-green-600 text-white hover:bg-green-700 ml-2"
          >
            Save
          </button>
        </div>
      </form>

      {toast.show && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded text-white ${toast.success ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default AddStudent;
