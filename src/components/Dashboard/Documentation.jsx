import React from "react";
import { motion } from "framer-motion";
import { Book, Code, AlertCircle, CheckCircle } from "lucide-react";
import { getApiUrl } from "../../config/apiConfig";

const Documentation = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Documentation</h1>
        <p className="text-gray-400">Complete guide to using the DigitalAxis API</p>
      </motion.div>

      {/* Quick Start */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <Book className="text-blue-400" size={20} />
          <h2 className="text-2xl font-semibold text-white">Quick Start</h2>
        </div>
        <ol className="list-decimal list-inside space-y-3 text-gray-300">
          <li>Create an API key from the API Access page</li>
          <li>Copy the client script from the Client Script page</li>
          <li>Replace <code className="bg-gray-900 px-1 rounded">YOUR_API_KEY_HERE</code> with your actual key</li>
          <li>Paste the script before the closing <code className="bg-gray-900 px-1 rounded">&lt;/body&gt;</code> tag</li>
          <li>Monitor predictions in real-time from your dashboard</li>
        </ol>
      </motion.section>

      {/* API Endpoint */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <Code className="text-blue-400" size={20} />
          <h2 className="text-2xl font-semibold text-white">API Endpoint</h2>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">POST /api/predict</h3>
            <p className="text-gray-400 mb-2">Send a prediction request with network and security data.</p>
            <div className="bg-gray-900 rounded-lg p-4">
              <code className="text-green-400">
                {getApiUrl("/predict")}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Headers</h3>
            <div className="bg-gray-900 rounded-lg p-4 space-y-2">
              <div>
                <code className="text-blue-400">Content-Type:</code>
                <span className="text-gray-300 ml-2">application/json</span>
              </div>
              <div>
                <code className="text-blue-400">x-api-key:</code>
                <span className="text-gray-300 ml-2">YOUR_API_KEY</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Request Body</h3>
            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-gray-300">{`{
  "network_packet_size": 1500,
  "protocol_type": "TCP",
  "login_attempts": 1,
  "session_duration": 300.0,
  "encryption_used": "AES",
  "ip_reputation_score": 0.9,
  "failed_logins": 0,
  "browser_type": "Chrome",
  "unusual_time_access": 0
}`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Response</h3>
            <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-gray-300">{`{
  "success": true,
  "prediction": {
    "prediction": 0,
    "probability": 0.15,
    "attack_detected": false,
    "locked_state": false
  }
}`}</code>
            </pre>
          </div>
        </div>
      </motion.section>

      {/* Error Codes */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-yellow-400" size={20} />
          <h2 className="text-2xl font-semibold text-white">Error Codes</h2>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 font-semibold">401</span>
              <span className="text-white">Unauthorized</span>
            </div>
            <p className="text-gray-400 text-sm">
              Missing or invalid API key. Check your x-api-key header.
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 font-semibold">400</span>
              <span className="text-white">Bad Request</span>
            </div>
            <p className="text-gray-400 text-sm">
              Invalid request body. Ensure all required fields are present and correctly formatted.
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-400 font-semibold">500</span>
              <span className="text-white">Internal Server Error</span>
            </div>
            <p className="text-gray-400 text-sm">
              Server error. Please try again later or contact support.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Best Practices */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="text-green-400" size={20} />
          <h2 className="text-2xl font-semibold text-white">Best Practices</h2>
        </div>
        <ul className="list-disc list-inside space-y-2 text-gray-300">
          <li>Keep your API keys secure and never expose them in client-side code</li>
          <li>Use HTTPS in production to encrypt API requests</li>
          <li>Implement rate limiting on your end to prevent abuse</li>
          <li>Monitor your API usage regularly through the dashboard</li>
          <li>Rotate API keys periodically for enhanced security</li>
          <li>Handle errors gracefully and implement retry logic</li>
          <li>Cache predictions when appropriate to reduce API calls</li>
        </ul>
      </motion.section>

      {/* Example cURL */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-white mb-4">Example cURL Request</h2>
        <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm">
          <code className="text-gray-300">{`curl -X POST ${getApiUrl("/predict")} \\
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
  }'`}</code>
        </pre>
      </motion.section>
    </div>
  );
};

export default Documentation;

