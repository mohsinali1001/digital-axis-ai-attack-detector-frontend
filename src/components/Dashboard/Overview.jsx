import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, AlertTriangle, Clock } from "lucide-react";
import API from "../../api/api";
import LiveFeed from "./LiveFeed";
import { useToast } from "../Toast/Toast";

const Overview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOverview = useCallback(async () => {
    try {
      const res = await API.get("/dashboard/overview");
      setOverview(res.data);
    } catch (error) {
      toast.error("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Predictions",
      value: overview?.total_predictions || 0,
      icon: Activity,
      color: "blue",
    },
    {
      label: "Attacks Detected",
      value: overview?.total_attacks || 0,
      icon: AlertTriangle,
      color: "red",
    },
    {
      label: "Safe Requests",
      value: (overview?.total_predictions || 0) - (overview?.total_attacks || 0),
      icon: Shield,
      color: "green",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Overview</h1>
        <p className="text-gray-400">Monitor your API usage and security metrics</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                  <Icon className={`text-${stat.color}-400`} size={24} />
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Latest Prediction */}
      {overview?.latest_prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-400" size={20} />
            <h2 className="text-xl font-semibold text-white">Latest Prediction</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Time:</span>
              <span className="text-white">
                {new Date(overview.latest_prediction.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Attack Detected:</span>
              <span
                className={
                  overview.latest_prediction.prediction?.attack_detected ||
                    overview.latest_prediction.prediction?.prediction === 1
                    ? "text-red-400 font-semibold"
                    : "text-green-400 font-semibold"
                }
              >
                {overview.latest_prediction.prediction?.attack_detected ||
                  overview.latest_prediction.prediction?.prediction === 1
                  ? "Yes"
                  : "No"}
              </span>
            </div>
            {overview.latest_prediction.prediction?.probability && (
              <div className="flex justify-between">
                <span className="text-gray-400">Probability:</span>
                <span className="text-white">
                  {(overview.latest_prediction.prediction.probability * 100).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Live Feed */}
      <LiveFeed />
    </div>
  );
};

export default Overview;

