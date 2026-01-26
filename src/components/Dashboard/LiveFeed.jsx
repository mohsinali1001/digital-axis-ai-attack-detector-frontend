import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { Radio, AlertTriangle, CheckCircle } from "lucide-react";
import { getSocketUrl } from "../../config/apiConfig";

const LiveFeed = () => {
  const [events, setEvents] = useState([]);
  const socketRef = useRef(null);
  const eventsEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return;

    // Connect to Socket.IO
    const socketUrl = getSocketUrl();
    socketRef.current = io(socketUrl, {
      auth: { token },
    });

    socketRef.current.emit("join", userId);

    socketRef.current.on("prediction", (data) => {
      setEvents((prev) => [data, ...prev].slice(0, 10)); // Keep last 10
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <Radio className="text-green-400 animate-pulse" size={20} />
        <h2 className="text-xl font-semibold text-white">Live Feed</h2>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {events.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Waiting for predictions... Events will appear here in real-time.
            </p>
          ) : (
            events.map((event) => {
              const isAttack =
                event.prediction?.attack_detected ||
                event.prediction?.prediction === 1;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 rounded-lg border ${
                    isAttack
                      ? "bg-red-500/10 border-red-500/50"
                      : "bg-green-500/10 border-green-500/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isAttack ? (
                        <AlertTriangle className="text-red-400" size={16} />
                      ) : (
                        <CheckCircle className="text-green-400" size={16} />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isAttack ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {isAttack ? "Attack Detected" : "Safe Request"}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {event.prediction?.probability && (
                    <p className="text-xs text-gray-400 mt-1">
                      Probability: {(event.prediction.probability * 100).toFixed(2)}%
                    </p>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={eventsEndRef} />
      </div>
    </motion.div>
  );
};

export default LiveFeed;

