import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import API from "../../api/api";
import { useToast } from "../Toast/Toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Logs = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const toast = useToast();

  const fetchPredictions = useCallback(async () => {
    try {
      let url = "/dashboard/predictions?limit=100";
      if (filter !== "all") {
        const now = new Date();
        let since;
        if (filter === "5min") {
          since = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
        } else if (filter === "1hour") {
          since = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        } else if (filter === "today") {
          since = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        }
        if (since) url += `&since=${since}`;
      }
      const res = await API.get(url);
      setPredictions(res.data.predictions);
    } catch (error) {
      toast.error("Failed to load predictions");
    } finally {
      setLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  // Prepare chart data
  const chartData = predictions
    .slice()
    .reverse()
    .map((p) => ({
      time: new Date(p.timestamp).toLocaleTimeString(),
      attack: p.prediction?.attack_detected || p.prediction?.prediction === 1 ? 1 : 0,
      safe: p.prediction?.attack_detected || p.prediction?.prediction === 1 ? 0 : 1,
      probability: p.prediction?.probability
        ? p.prediction.probability * 100
        : 0,
    }));

  // Group by hour for bar chart
  const hourlyData = predictions.reduce((acc, p) => {
    const hour = new Date(p.timestamp).getHours();
    const isAttack = p.prediction?.attack_detected || p.prediction?.prediction === 1;
    if (!acc[hour]) {
      acc[hour] = { hour: `${hour}:00`, attacks: 0, safe: 0 };
    }
    if (isAttack) {
      acc[hour].attacks++;
    } else {
      acc[hour].safe++;
    }
    return acc;
  }, {});

  const hourlyChartData = Object.values(hourlyData).sort(
    (a, b) => parseInt(a.hour) - parseInt(b.hour)
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Logs & Monitoring</h1>
            <p className="text-gray-400">View and analyze your prediction history</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="5min">Last 5 Minutes</option>
              <option value="1hour">Last Hour</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      {predictions.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Attacks Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attack"
                  stroke="#EF4444"
                  name="Attacks"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="safe"
                  stroke="#10B981"
                  name="Safe"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Hourly Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                />
                <Legend />
                <Bar dataKey="attacks" fill="#EF4444" name="Attacks" />
                <Bar dataKey="safe" fill="#10B981" name="Safe" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}

      {/* Predictions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Recent Predictions</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : predictions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No predictions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Timestamp</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400">Probability</th>
                  <th className="text-left py-3 px-4 text-gray-400">IP</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred) => {
                  const isAttack =
                    pred.prediction?.attack_detected || pred.prediction?.prediction === 1;
                  return (
                    <tr
                      key={pred.id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30"
                    >
                      <td className="py-3 px-4 text-white">
                        {new Date(pred.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-medium ${isAttack
                            ? "bg-red-500/10 text-red-400"
                            : "bg-green-500/10 text-green-400"
                            }`}
                        >
                          {isAttack ? "Attack" : "Safe"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {pred.prediction?.probability
                          ? `${(pred.prediction.probability * 100).toFixed(2)}%`
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-400">{pred.ip || "N/A"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Logs;

