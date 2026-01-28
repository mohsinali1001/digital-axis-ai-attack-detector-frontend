import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Check } from "lucide-react";
import API from "../../api/api";
import { getApiUrl } from "../../config/apiConfig";
import { useToast } from "../Toast/Toast";

const ClientScript = () => {
  const [keys, setKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const fetchKeys = useCallback(async () => {
    try {
      const res = await API.get("/apikeys");
      setKeys(res.data.keys);
      if (res.data.keys.length > 0) {
        // Use the first key (you might want to show full key here, but for security we'll use masked)
        // In production, you'd need to store the full key when created
        setSelectedKey("YOUR_API_KEY_HERE");
      }
    } catch (error) {
      toast.error("Failed to load API keys");
    }
  }, [toast]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const API_URL = getApiUrl("/predict");
  const script = `(function(){
  const API_URL = "${API_URL}";
  const API_KEY = "${selectedKey}";

  function sendEvent(payload){
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
      body: JSON.stringify(payload)
    }).catch(()=>{/* silent */});
  }

  window.addEventListener("load", ()=>{
    sendEvent({
      network_packet_size: 1500,
      protocol_type: "TCP",
      login_attempts: 1,
      session_duration: 300.0,
      encryption_used: "AES",
      ip_reputation_score: 0.9,
      failed_logins: 0,
      browser_type: "Chrome",
      unusual_time_access: 0
    });
  });

  window.DA = { sendEvent };
})();`;

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Client Script</h1>
        <p className="text-gray-400">
          Copy and paste this script into your website to enable attack detection
        </p>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-blue-400 mb-2">Quick Start</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Replace <code className="bg-gray-800 px-1 rounded">YOUR_API_KEY_HERE</code> with your actual API key</li>
          <li>Copy the script below</li>
          <li>Paste it before the closing <code className="bg-gray-800 px-1 rounded">&lt;/body&gt;</code> tag of your HTML</li>
          <li>The script will automatically send events on page load</li>
          <li>You can also manually send events using <code className="bg-gray-800 px-1 rounded">window.DA.sendEvent(payload)</code></li>
        </ol>
      </motion.div>

      {/* API Key Selection */}
      {keys.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
        >
          <label className="text-sm text-gray-400 mb-2 block">Select API Key:</label>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="YOUR_API_KEY_HERE">-- Select or enter your API key --</option>
            {keys.map((key) => (
              <option key={key.id} value={key.key}>
                {key.label || "Unnamed Key"} ({key.key})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Note: You need to enter your full API key. Keys shown here are masked for security.
          </p>
        </motion.div>
      )}

      {/* Script Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="text-blue-400" size={20} />
            <h2 className="text-xl font-semibold text-white">Universal Script</h2>
          </div>
          <button
            onClick={copyScript}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied!" : "Copy Script"}
          </button>
        </div>
        <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
          <code>{script}</code>
        </pre>
      </motion.div>

      {/* Usage Example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Manual Event Sending</h2>
        <p className="text-gray-400 mb-4">
          After including the script, you can manually send events from your JavaScript:
        </p>
        <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300">
          <code>{`// Send a custom event
window.DA.sendEvent({
  network_packet_size: 1200,
  protocol_type: "HTTPS",
  login_attempts: 3,
  session_duration: 450.5,
  encryption_used: "TLS",
  ip_reputation_score: 0.85,
  failed_logins: 1,
  browser_type: "Firefox",
  unusual_time_access: 0
});`}</code>
        </pre>
      </motion.div>
    </div>
  );
};

export default ClientScript;

