import { useEffect, useState } from "react";
import axios from "axios";
import EventLabelTable from "../components/EventLabelTable";

export default function EventLabel() {
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventLabels, setEventLabels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [editingLabelId, setEditingLabelId] = useState(null);

  const [formData, setFormData] = useState({
    event: "",
    color: "",
    status: "",
  });

  const fetchEventLabels = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/eventlabel?page=${currentPage}&limit=${entriesPerPage}&search=${searchQuery}`
      );
      setEventLabels(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    } catch (err) {
      console.error("Error fetching event labels:", err);
      setToast({
        show: true,
        message: "Failed to fetch event labels",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  useEffect(() => {
    fetchEventLabels();
  }, [entriesPerPage, currentPage, searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event label?")) {
      try {
        await axios.delete(`http://localhost:5000/eventlabel/delete/${id}`);
        fetchEventLabels();
        setToast({
          show: true,
          message: "Label deleted successfully",
          success: true,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: true }),
          2000
        );
      } catch (err) {
        console.error("Failed to delete label:", err);
        setToast({
          show: true,
          message: "Failed to delete label",
          success: false,
        });
        setTimeout(
          () => setToast({ show: false, message: "", success: false }),
          2000
        );
      }
    }
  };

  const handleEdit = (label) => {
    setFormData({
      event: label.event,
      color: label.color,
      status: label.status,
    });
    setEditingLabelId(label._id);
    setShowModal(true);
  };

  const handleSaveLabel = async () => {
    if (!formData.event || !formData.color || !formData.status) {
      setToast({
        show: true,
        message: "Please fill out all fields",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
      return;
    }

    try {
      if (editingLabelId) {
        await axios.put(
          `http://localhost:5000/eventlabel/updateEventLabel/${editingLabelId}`,
          formData
        );
        setToast({
          show: true,
          message: "Event label updated successfully",
          success: true,
        });
      } else {
        await axios.post(
          "http://localhost:5000/eventlabel/addEventLabel",
          formData
        );
        setToast({
          show: true,
          message: "Event label added successfully",
          success: true,
        });
      }
      setShowModal(false);
      setFormData({ event: "", color: "", status: "" });
      setEditingLabelId(null);
      fetchEventLabels();
      setTimeout(
        () => setToast({ show: false, message: "", success: true }),
        2000
      );
    } catch (err) {
      console.error("Failed to save event label:", err);
      setToast({
        show: true,
        message: "Failed to save event label",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  const colors = [
    { color: "red" },
    { color: "green" },
    { color: "blue" },
    { color: "yellow" },
    { color: "orange" },
    { color: "pink" },
    { color: "purple" },
    { color: "violet" },
  ];

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
            onClick={() => {
              setFormData({ event: "", color: "", status: "" });
              setEditingLabelId(null);
              setShowModal(true);
            }}
          >
            + Add
          </button>
        </section>
      </div>

      <EventLabelTable
        labels={eventLabels}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <footer className="flex justify-between mt-5">
        <section>
          Showing {Math.min((currentPage - 1) * entriesPerPage + 1, totalCount)}{" "}
          to {Math.min(currentPage * entriesPerPage, totalCount)} of{" "}
          {totalCount} entries
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
            <h3 className="text-lg font-semibold">
              {editingLabelId ? "Edit Event Label" : "Add Event Label"}
            </h3>

            <div className="space-y-1">
              <div className="font-medium text-sm">Event Label Name</div>
              <input
                type="text"
                value={formData.event}
                onChange={(e) =>
                  setFormData({ ...formData, event: e.target.value })
                }
                placeholder="Enter event label name"
                className="w-full border rounded p-2"
              />
            </div>

            <div className="space-y-1">
              <div className="font-medium text-sm">Event Label Color</div>
              <div className="flex gap-2 flex-wrap">
                {colors.map(({ color }, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded cursor-pointer border-2 ${formData.color === color ? "border-black" : "border-gray-300"}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
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
                onClick={() => {
                  setShowModal(false);
                  setFormData({ event: "", color: "", status: "" });
                  setEditingLabelId(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLabel}
                className="px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600"
              >
                {editingLabelId ? "Update" : "Add"}
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
