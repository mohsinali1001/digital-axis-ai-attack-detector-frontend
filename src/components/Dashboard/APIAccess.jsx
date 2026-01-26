import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Copy, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import API from "../../api/api";
import { getApiUrl } from "../../config/apiConfig";
import { useToast } from "../Toast/Toast";

const APIAccess = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKey, setNewKey] = useState(null);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await API.get("/apikeys");
      setKeys(res.data.keys);
    } catch (error) {
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    try {
      const res = await API.post("/apikeys", { label: newKeyLabel || null });
      setNewKey(res.data.key.key);
      setShowNewKey(true);
      setNewKeyLabel("");
      fetchKeys();
      toast.success("API key created successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create API key");
    }
  };

  const deleteKey = async (keyId) => {
    if (!window.confirm("Are you sure you want to delete this API key?")) return;

    try {
      await API.delete(`/apikeys/${keyId}`);
      toast.success("API key deleted");
      fetchKeys();
    } catch (error) {
      toast.error("Failed to delete API key");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const API_ENDPOINT = getApiUrl("/predict");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">API Access</h1>
        <p className="text-gray-400">Manage your API keys and access credentials</p>
      </motion.div>

      {/* New Key Modal */}
      {showNewKey && newKey && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowNewKey(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">New API Key</h2>
            <p className="text-gray-400 mb-4 text-sm">
              ⚠️ Save this key now. You won't be able to see it again!
            </p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <code className="text-green-400 text-sm break-all">{newKey}</code>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(newKey)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy size={16} />
                Copy Key
              </button>
              <button
                onClick={() => {
                  setShowNewKey(false);
                  setNewKey(null);
                }}
                className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Create New Key */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <Plus className="text-blue-400" size={20} />
          <h2 className="text-xl font-semibold text-white">Create New API Key</h2>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Label (optional)"
            value={newKeyLabel}
            onChange={(e) => setNewKeyLabel(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={createKey}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Key size={16} />
            Create Key
          </button>
        </div>
      </motion.div>

      {/* Existing Keys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Your API Keys</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : keys.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No API keys yet. Create one above.</p>
        ) : (
          <div className="space-y-3">
            {keys.map((key) => (
              <div
                key={key.id}
                className="bg-gray-900 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Key className="text-blue-400" size={16} />
                    {key.label && (
                      <span className="text-white font-medium">{key.label}</span>
                    )}
                  </div>
                  <code className="text-gray-400 text-sm">{key.key}</code>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(key.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(key.key)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Copy key"
                >
                  <Copy size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* API Usage Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">API Endpoint</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Endpoint URL:</label>
            <div className="flex gap-2">
              <code className="flex-1 bg-gray-900 rounded-lg px-4 py-2 text-green-400">
                {API_ENDPOINT}
              </code>
              <button
                onClick={() => copyToClipboard(API_ENDPOINT)}
                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Copy size={16} className="text-white" />
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Header:</label>
            <code className="block bg-gray-900 rounded-lg px-4 py-2 text-blue-400">
              x-api-key: YOUR_API_KEY
            </code>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Example cURL:</label>
            <pre className="bg-gray-900 rounded-lg px-4 py-2 text-sm text-gray-300 overflow-x-auto">
              {`curl -X POST ${API_ENDPOINT} \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "network_packet_size": 1500,
    "protocol_type": "TCP",
    "login_attempts": 1,
    "session_duration": 300.0,
    "encryption_used": "AES",
    "ip_reputation_score": 0.9,
    "failed_logins": 0,
    "browser_type": "Chrome",
    "unusual_time_access": 0
  }'`}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default APIAccess;

