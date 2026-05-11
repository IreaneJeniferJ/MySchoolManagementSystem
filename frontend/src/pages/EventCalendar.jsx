import React, { useState, useEffect } from "react";
import axios from "axios";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function Events() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [labels, setLabels] = useState([]);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [showQuickEventForm, setShowQuickEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    label: "",
    start: "",
    end: "",
    description: "",
  });
  const [quickEventData, setQuickEventData] = useState({
    title: "",
    label: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });

  const getFormattedDate = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const changeMonth = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/events");
      if (Array.isArray(response.data)) {
        setEvents(response.data);
        localStorage.setItem("events", JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
    }
  };

  const handleNewEventSubmit = async () => {
    if (formData.title && formData.label && formData.start) {
      const startDate = new Date(formData.start);
      const endDate = formData.end ? new Date(formData.end) : startDate;

      const newEvent = {
        title: formData.title,
        label: formData.label,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        description: formData.description,
      };

      try {
        await axios.post("http://localhost:5000/events/addEvent", newEvent);
        await fetchEvents();
        setShowNewEventForm(false);
        setFormData({
          title: "",
          label: "",
          start: "",
          end: "",
          description: "",
        });
        setToast({
          show: true,
          message: "Event Added Successfully",
          success: true,
        });
      } catch (err) {
        console.error("Failed to add event:", err);
        setToast({
          show: true,
          message: "Failed to Add Event",
          success: false,
        });
      }
      setTimeout(
        () => setToast({ show: false, message: "", success: true }),
        2000
      );
    } else {
      setToast({
        show: true,
        message: "Failed to Add Event: Missing Fields",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  const handleQuickEventSubmit = async () => {
    if (quickEventData.title && quickEventData.label && selectedDate) {
      const newEvent = {
        title: quickEventData.title,
        label: quickEventData.label,
        description: "",
        startDate: selectedDate,
        endDate: selectedDate,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/events/addEvent",
          newEvent
        );

        if (response.status === 201) {
          await fetchEvents();
          setShowQuickEventForm(false);
          setQuickEventData({ title: "", label: "" });
          setToast({
            show: true,
            message: "Event Added Successfully",
            success: true,
          });
        } else {
          throw new Error("Server error");
        }
      } catch (err) {
        console.error("Failed to add event:", err);
        setToast({
          show: true,
          message: "Failed to Add Event",
          success: false,
        });
      }

      setTimeout(
        () => setToast({ show: false, message: "", success: true }),
        2000
      );
    } else {
      setToast({
        show: true,
        message: "Failed to Add Event: Missing Fields",
        success: false,
      });
      setTimeout(
        () => setToast({ show: false, message: "", success: false }),
        2000
      );
    }
  };

  const generateSimpleCalendarTable = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let rows = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      let cells = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || day > daysInMonth) {
          cells.push(
            <td key={j} className="border rounded bg-white h-[30px] p-1"></td>
          );
        } else {
          const thisDate = getFormattedDate(year, month, day);

          cells.push(
            <td
              key={j}
              className="border rounded bg-white h-[30px] p-1 cursor-pointer"
              onClick={() => {
                setSelectedDate(thisDate);
                setShowQuickEventForm(true);
              }}
            >
              <div className="font-medium text-xs">{day}</div>
            </td>
          );
          day++;
        }
      }
      rows.push(<tr key={i}>{cells}</tr>);
    }

    return (
      <table className="w-full table-fixed text-[11px] sm:text-xs text-gray-700 text-center border-separate border-spacing-[2px]">
        <thead>
          <tr className="text-gray-500">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  const generateCalendarTable = (isSmall = false) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let rows = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      let cells = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || day > daysInMonth) {
          cells.push(
            <td
              key={j}
              className={`border rounded bg-white ${isSmall ? "h-[30px]" : "h-[80px]"} p-1`}
            ></td>
          );
        } else {
          const thisDateStr = getFormattedDate(year, month, day);
          const thisDate = new Date(thisDateStr);

          const dayEvents = events.filter((e) => {
            const start = new Date(e.startDate);
            const end = new Date(e.endDate);
            return thisDate >= start && thisDate <= end;
          });

          cells.push(
            <td
              key={j}
              className={`border rounded bg-white ${isSmall ? "h-[30px]" : "h-[80px]"} p-1 overflow-hidden align-top cursor-pointer`}
              onClick={() => {
                setSelectedDate(thisDateStr);
                setShowQuickEventForm(true);
              }}
            >
              <div className="font-medium text-xs">{day}</div>
              <div className={`space-y-0.5 ${isSmall ? "mt-0.5" : "mt-1"}`}>
                {dayEvents.map((e, idx) => (
                  <div
                    key={idx}
                    className="w-full px-1 py-0.5 text-[10px] rounded truncate whitespace-nowrap overflow-hidden text-ellipsis bg-cyan-200"
                    title={e.title}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            </td>
          );
          day++;
        }
      }
      rows.push(<tr key={i}>{cells}</tr>);
    }

    return (
      <table className="w-full table-fixed text-[11px] sm:text-xs text-gray-700 text-center border-separate border-spacing-[2px]">
        <thead>
          <tr className="text-gray-500">
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  useEffect(() => {
    fetchEvents();
    const fetchLabels = async () => {
      try {
        const response = await axios.get("http://localhost:5000/eventlabel");
        setLabels(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        console.error("Failed to fetch labels:", err);
        setLabels([]);
      }
    };
    fetchLabels();
  }, []);

  return (
    <main className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-6">
        <aside className="bg-white w-full xl:w-[300px] flex-shrink-0 rounded-md shadow p-5 space-y-6">
          <button
            onClick={() => setShowNewEventForm(true)}
            className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-white font-semibold py-2 rounded-md text-sm"
          >
            + New Event
          </button>

          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-semibold text-gray-700">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="space-x-2">
                <button
                  onClick={() => changeMonth(-1)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  &lt;
                </button>
                <button
                  onClick={() => changeMonth(1)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  &gt;
                </button>
              </div>
            </div>
            <div>{generateSimpleCalendarTable()}</div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Event Labels
            </h4>
            <div className="space-y-2 text-sm">
              {(Array.isArray(labels) ? labels : []).map((label, idx) => (
                <div className="flex items-center gap-2" key={idx}>
                  <div
                    className="w-4 h-4 rounded-sm border-2"
                    style={{ borderColor: label.color || "#999" }}
                  ></div>
                  <span>{label.event}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-white rounded-md shadow p-6 overflow-x-auto xl:min-h-[750px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &lt;
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &gt;
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-700">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div></div>
          </div>
          <div>{generateCalendarTable()}</div>
        </section>
      </div>

      {showNewEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">Add New Event</h3>
            <div className="space-y-1">
              <div className="font-medium text-sm">Event Title</div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter event title"
                className="w-full border rounded p-2"
              />
            </div>

            <div className="space-y-1">
              <div className="font-medium text-sm">Event Label</div>
              <select
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                className="w-full border rounded p-2"
              >
                <option value="">Select label</option>
                {labels.map((label) => (
                  <option key={label._id} value={label._id}>
                    {label.event}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="font-medium text-sm">Start Date</div>
              <input
                type="date"
                value={formData.start}
                onChange={(e) =>
                  setFormData({ ...formData, start: e.target.value })
                }
                className="w-full border rounded p-2"
              />
            </div>

            <div className="space-y-1">
              <div className="font-medium text-sm">End Date</div>
              <input
                type="date"
                value={formData.end}
                min={formData.start}
                onChange={(e) =>
                  setFormData({ ...formData, end: e.target.value })
                }
                className="w-full border rounded p-2"
              />
            </div>

            <div className="space-y-1">
              <div className="font-medium text-sm">Description</div>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewEventForm(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleNewEventSubmit}
                className="px-4 py-2 rounded bg-cyan-500 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuickEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6 space-y-4 shadow-lg">
            <h3 className="text-lg font-semibold">
              Add Event on {selectedDate}
            </h3>
            <input
              type="text"
              value={quickEventData.title}
              onChange={(e) =>
                setQuickEventData({ ...quickEventData, title: e.target.value })
              }
              placeholder="Event Title"
              className="w-full border rounded p-2"
            />
            <select
              value={quickEventData.label}
              onChange={(e) =>
                setQuickEventData({ ...quickEventData, label: e.target.value })
              }
              className="w-full border rounded p-2"
            >
              <option value="">Select Label</option>
              {labels.map((label) => (
                <option key={label._id} value={label._id}>
                  {label.event}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowQuickEventForm(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickEventSubmit}
                className="px-4 py-2 rounded bg-cyan-500 text-white"
              >
                Add
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
    </main>
  );
}

export default Events;
