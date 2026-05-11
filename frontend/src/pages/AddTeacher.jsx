import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const AddTeacher = () => {
  const [staffID, setStaffID] = useState("");
  const [staffName, setStaffName] = useState("");
  const [workRole, setWorkRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [classAssigned, setClassAssigned] = useState("");
  const [staffMobileNumber, setStaffMobileNumber] = useState("");
  const [staffAlternateMobileNumber, setStaffAlternateMobileNumber] =
    useState("");
  const [staffAddress, setStaffAddress] = useState("");
  const [staffLandMark, setStaffLandMark] = useState("");
  const [staffCity, setStaffCity] = useState("");
  const [staffState, setStaffState] = useState("");
  const [staffCountry, setStaffCountry] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffCount = async () => {
      try {
        const res = await axios.get("http://localhost:5000/staff/staffCount");
        const count = res.data.count + 1;
        const year = new Date().getFullYear();
        const paddedCount = String(count).padStart(3, "0");
        const id = `RS${year}T${paddedCount}`;
        setStaffID(id);
      } catch (err) {
        console.error("Error generating staff ID:", err);
      }
    };

    const fetchStaffRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/staffRole");
        const activeRoles = response.data.data.filter(
          (role) => role.status === "Active"
        );
        setRoles(activeRoles);
      } catch (err) {
        console.error("Failed to fetch staff roles:", err);
      }
    };

    fetchStaffCount();
    fetchStaffRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/staff/addStaff",
        {
          staffId: staffID,
          staffName,
          workingRole: workRole,
          class: classAssigned,
          mobileNumber: staffMobileNumber,
          alternateMobileNumber: staffAlternateMobileNumber,
          address: staffAddress,
          landmark: staffLandMark,
          city: staffCity,
          state: staffState,
          country: staffCountry,
        }
      );

      console.log("Staff added:", response.data);
      setToast({ show: true, message: "Added Successfully", success: true });
      setTimeout(
        () => setToast({ show: false, message: "", success: true }),
        2000
      );
    } catch (err) {
      console.error("Error adding staff:", err);
      setToast({ show: true, message: "Failed to Add", success: false });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  return (
    <section>
      <h1 className="flex justify-center text-2xl text-gray-600">Add Staff</h1>
      <form className="grid grid-cols-1 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div className="p-2">
          <label htmlFor="StaffID">Staff ID</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="StaffID"
            value={staffID}
            placeholder="Auto-generated"
            disabled
          />
        </div>

        <div className="p-2">
          <label htmlFor="StaffName">Staff Name</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="StaffName"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            placeholder="Enter staff name"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="WorkRole">Working Role</label>
          <br />
          <select
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            id="WorkRole"
            value={workRole}
            onChange={(e) => setWorkRole(e.target.value)}
            required
          >
            <option value="">Select Working Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.staffRole}
              </option>
            ))}
          </select>
        </div>

        <div className="p-2">
          <label htmlFor="Class">Class</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="Class"
            value={classAssigned}
            onChange={(e) => setClassAssigned(e.target.value)}
            placeholder="Enter Class"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="staffMobileNumber">Mobile Number</label>
          <br />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            id="staffMobileNumber"
            value={staffMobileNumber}
            onChange={(e) =>
              setStaffMobileNumber(e.target.value.replace(/\D/, ""))
            }
            placeholder="Enter 10-digit mobile number"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="staffAlternateMobileNumber">
            Alternate Mobile Number
          </label>
          <br />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            id="staffAlternateMobileNumber"
            value={staffAlternateMobileNumber}
            onChange={(e) =>
              setStaffAlternateMobileNumber(e.target.value.replace(/\D/, ""))
            }
            placeholder="Enter 10-digit alternate mobile number"
          />
        </div>

        <div className="p-2">
          <label htmlFor="staffAddress">Address</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="staffAddress"
            value={staffAddress}
            onChange={(e) => setStaffAddress(e.target.value)}
            placeholder="Enter address"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="staffLandMark">Landmark</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="staffLandMark"
            value={staffLandMark}
            onChange={(e) => setStaffLandMark(e.target.value)}
            placeholder="Enter Landmark"
          />
        </div>

        <div className="p-2">
          <label htmlFor="staffCity">City</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="staffCity"
            value={staffCity}
            onChange={(e) => setStaffCity(e.target.value)}
            placeholder="Enter city"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="staffState">State</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="staffState"
            value={staffState}
            onChange={(e) => setStaffState(e.target.value)}
            placeholder="Enter State"
            required
          />
        </div>

        <div className="p-2">
          <label htmlFor="staffCountry">Country</label>
          <br />
          <input
            className="p-2 w-full mt-1 border border-gray-300 rounded-sm"
            type="text"
            id="staffCountry"
            value={staffCountry}
            onChange={(e) => setStaffCountry(e.target.value)}
            placeholder="Enter Country"
            required
          />
        </div>

        <div className="flex justify-end col-span-2 mt-5">
          <button
            type="button"
            className="border px-5 py-2 bg-gray-400 text-white hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate("/teachers")}
          >
            Back
          </button>

          <button
            type="submit"
            className="border px-5 py-2 bg-green-600 text-white hover:bg-green-700 cursor-pointer ml-2"
          >
            Save
          </button>
        </div>
      </form>

      {toast.show && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white transition-opacity duration-300 ${toast.success ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
    </section>
  );
};

export default AddTeacher;
