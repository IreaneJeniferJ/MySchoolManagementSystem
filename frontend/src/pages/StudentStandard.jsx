import { useEffect, useState } from "react";
import axios from "axios";
import StudentStandardTable from "../components/StudentStandardTable";

export default function StudentStandard() {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [standards, setStandards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [formData, setFormData] = useState({ label: "", status: "" });
  const [editData, setEditData] = useState({ id: "", status: "" });

  const fetchStandards = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/standard?page=${currentPage}&limit=${entriesPerPage}&search=${searchQuery}`
      );
      const data = response.data;
      setStandards(Array.isArray(data.data) ? data.data : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching standards:", err);
      setStandards([]);
      setToast({
        show: true,
        message: "Failed to fetch standards",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  useEffect(() => {
    fetchStandards();
  }, [entriesPerPage, currentPage, searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this standard?")) {
      try {
        await axios.delete(`http://localhost:5000/standard/delete/${id}`);
        fetchStandards();
        setToast({
          show: true,
          message: "Standard deleted successfully",
          success: true,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: true }),
          2000
        );
      } catch (err) {
        console.error("Failed to delete standard:", err);
        setToast({
          show: true,
          message: "Failed to delete standard",
          success: false,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: false }),
          2000
        );
      }
    }
  };

  const handleEdit = (standard) => {
    setEditData({ id: standard._id, status: standard.status });
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    try {
      if (!editData.status) {
        setToast({
          show: true,
          message: "Please select a status",
          success: false,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: false }),
          2000
        );
        return;
      }
      await axios.put(`http://localhost:5000/standard/update/${editData.id}`, {
        status: editData.status,
      });
      setShowEditModal(false);
      fetchStandards();
      setToast({
        show: true,
        message: "Standard updated successfully",
        success: true,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: true }),
        2000
      );
    } catch (err) {
      console.error("Failed to update standard:", err);
      setToast({
        show: true,
        message: "Failed to update standard",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  const handleAddStandard = async () => {
    try {
      if (!formData.label || !formData.status) {
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

      const isValidStandard = /^(?:[1-9]|1[0-2]|PRE-KG|LKG|UKG)$/.test(
        formData.label
      );
      if (!isValidStandard) {
        setToast({
          show: true,
          message: "Invalid standard (1-12, Pre-KG, LKG, UKG)",
          success: false,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: false }),
          2000
        );
        return;
      }

      let standardValue = /^\d+$/.test(formData.label)
        ? parseInt(formData.label, 10)
        : formData.label;

      await axios.post("http://localhost:5000/standard/addStandards", {
        standard: standardValue,
        status: formData.status,
      });

      setShowAddModal(false);
      setFormData({ label: "", status: "" });
      setCurrentPage(1);
      fetchStandards();
      setToast({
        show: true,
        message: "Standard added successfully",
        success: true,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: true }),
        2000
      );
    } catch (err) {
      console.error("Failed to add standard:", err);
      setToast({
        show: true,
        message: "Failed to add standard",
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
          <label htmlFor="entries">Entries</label>
        </form>

        <section className="flex justify-around gap-3 items-center">
          <input
            className="border border-gray-300 px-1"
            type="text"
            placeholder="Search here"
            id="searchData"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            className="border border-solid bg-blue-500 hover:bg-blue-700 px-2 py-1 rounded-sm text-white"
            onClick={() => setShowAddModal(true)}
          >
            + Add
          </button>
        </section>
      </div>

      <StudentStandardTable
        standards={standards}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <footer className="flex justify-between mt-5">
        <section>
          {Array.isArray(standards) && standards.length > 0
            ? `Showing ${Math.min((currentPage - 1) * entriesPerPage + 1, standards.length)} to ${Math.min(currentPage * entriesPerPage, standards.length)} of ${standards.length} entries`
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Add Standard</h3>

            <div className="space-y-1">
              <div className="font-medium text-sm">Enter Standard</div>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    label: e.target.value.toUpperCase(),
                  })
                }
                placeholder="1-12, Pre-KG, LKG, UKG"
                className="w-full border rounded p-2 uppercase"
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
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStandard}
                className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Edit Standard Status</h3>

            <div className="space-y-1">
              <div className="font-medium text-sm">Change Status</div>
              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({ ...editData, status: e.target.value })
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
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
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
