import { useEffect, useState } from "react";
import axios from "axios";
import StaffRoleTable from "../components/StaffRoleTable";

export default function StaffRole() {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editModalData, setEditModalData] = useState(null); // NEW: edit state
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [formData, setFormData] = useState({
    staffRole: "",
    status: "",
  });

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/staffrole?page=${currentPage}&limit=${entriesPerPage}&search=${searchQuery}`
      );
      setRoles(Array.isArray(response.data.data) ? response.data.data : []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching staff roles:", err);
      setRoles([]);
      setToast({
        show: true,
        message: "Failed to fetch staff roles",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [entriesPerPage, currentPage, searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff role?")) {
      try {
        await axios.delete(`http://localhost:5000/staffrole/delete/${id}`);
        fetchRoles();
        setToast({
          show: true,
          message: "Staff role deleted successfully",
          success: true,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: true }),
          2000
        );
      } catch (err) {
        console.error("Failed to delete staff role:", err);
        setToast({
          show: true,
          message: "Failed to delete staff role",
          success: false,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: false }),
          2000
        );
      }
    }
  };

  const handleEdit = (role) => {
    setEditModalData(role);
  };

  const handleAddRole = async () => {
    try {
      if (!formData.staffRole || !formData.status) {
        setToast({
          show: true,
          message: "Please fill out both fields",
          success: false,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: false }),
          2000
        );
        return;
      }
      await axios.post("http://localhost:5000/staffrole/addRole", formData);
      setShowModal(false);
      setFormData({ staffRole: "", status: "" });
      fetchRoles();
      setToast({
        show: true,
        message: "Staff role added successfully",
        success: true,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: true }),
        2000
      );
    } catch (err) {
      console.error("Failed to add staff role:", err);
      setToast({
        show: true,
        message: "Failed to add staff role",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  const handleUpdateRole = async (updatedData) => {
    try {
      if (!updatedData.staffRole || !updatedData.status) {
        setToast({
          show: true,
          message: "Please fill out both fields",
          success: false,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: false }),
          2000
        );
        return;
      }
      await axios.put(
        `http://localhost:5000/staffrole/updateRole/${updatedData._id}`,
        updatedData
      );
      setEditModalData(null);
      fetchRoles();
      setToast({
        show: true,
        message: "Staff role updated successfully",
        success: true,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: true }),
        2000
      );
    } catch (err) {
      console.error("Failed to update staff role:", err);
      setToast({
        show: true,
        message: "Failed to update staff role",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  return (
    <section>
      <div className="flex justify-between mb-5">
        <form className="flex gap-3 items-center">
          <label htmlFor="entries">Show</label>
          <select
            className="border border-solid px-1"
            id="entries"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="border border-solid bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded-sm text-white"
            onClick={() => setShowModal(true)}
          >
            + Add
          </button>
        </section>
      </div>

      <StaffRoleTable
        roles={roles}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <footer className="flex justify-between mt-5">
        <section>
          {Array.isArray(roles) && roles.length > 0
            ? `Showing ${Math.min((currentPage - 1) * entriesPerPage + 1, roles.length)} to ${Math.min(currentPage * entriesPerPage, roles.length)} of ${roles.length} entries`
            : "No entries"}
        </section>

        <nav>
          <ul className="flex gap-2">
            <li>
              <button
                disabled={currentPage === 1}
                className="border px-2 py-1 rounded-sm border-gray-500  text-gray-500 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li key={i}>
                <button
                  className={`border px-2 py-1 rounded-sm ${currentPage === i + 1 ? "bg-blue-500" : "bg-gray-400"} hover:bg-lime-700 text-white`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li>
              <button
                disabled={currentPage === totalPages}
                className="border px-2 py-1 rounded-sm border-gray-500  text-gray-500 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </footer>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Add Staff Role</h3>

            <div className="space-y-1">
              <div className="font-medium text-sm">Staff Role Name</div>
              <input
                type="text"
                value={formData.staffRole}
                onChange={(e) =>
                  setFormData({ ...formData, staffRole: e.target.value })
                }
                placeholder="Enter staff role"
                className="w-full border rounded p-2"
              />
            </div>

            <div className="space-y-1">
              <div className="font-medium text-sm">Status</div>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border rounded p-2 appearance-none"
              >
                <option value="">Select status</option>
                <option value="Active">🟢 Active</option>
                <option value="Inactive">🔴 Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Edit Staff Role</h3>

            <div className="space-y-1">
              <div className="font-medium text-sm">Staff Role Name</div>
              <input
                type="text"
                value={editModalData.staffRole}
                onChange={(e) =>
                  setEditModalData({
                    ...editModalData,
                    staffRole: e.target.value,
                  })
                }
                className="w-full border rounded p-2"
              />
            </div>

            <div className="space-y-1">
              <div className="font-medium text-sm">Status</div>
              <select
                value={editModalData.status}
                onChange={(e) =>
                  setEditModalData({ ...editModalData, status: e.target.value })
                }
                className="w-full border rounded p-2 appearance-none"
              >
                <option value="Active">🟢 Active</option>
                <option value="Inactive">🔴 Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditModalData(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateRole(editModalData)}
                className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white transition-opacity duration-300 ${toast.success ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
    </section>
  );
}
