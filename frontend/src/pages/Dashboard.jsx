import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Users, BookUser } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalEvents: 0,
    studentDistribution: [],
    upcomingEvents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/dashboard/stats"
        );
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return <div className="p-6 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <BookUser className="text-cyan-400" />
              <div>
                <div className="text-sm">Total Students</div>
                <div className="text-2xl font-bold">
                  {stats.totalStudents ?? "-"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="text-yellow-400" />
              <div>
                <div className="text-sm">Total Staff</div>
                <div className="text-2xl font-bold">
                  {stats.totalStaff ?? "-"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="text-green-400" />
              <div>
                <div className="text-sm">Events</div>
                <div className="text-2xl font-bold">
                  {stats.totalEvents ?? "-"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-4">Students Status</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.studentDistribution || []}>
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Boy" fill="#00BCD4" />
                <Bar dataKey="Girl" fill="#E91E63" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-4">Upcoming Events</div>
            <div className="space-y-4">
              {(stats.upcomingEvents || []).length > 0 ? (
                stats.upcomingEvents.map((day, idx) => (
                  <div key={idx}>
                    <div className="font-medium text-sm mb-1">{day.day}</div>
                    <div className="space-y-1">
                      {day.events.map((e, i) => (
                        <div
                          key={i}
                          className={`flex justify-between items-center px-3 py-1 rounded text-white ${e.color}`}
                        >
                          <span>{e.time}</span>
                          <span>{e.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No upcoming events found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
