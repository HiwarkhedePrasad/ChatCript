import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <motion.h1
        className="text-5xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to ChatScript
      </motion.h1>

      <motion.p
        className="text-xl mb-8 max-w-2xl text-center text-gray-300"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        ChatScript offers end-to-end encrypted messaging without storing any of
        your messages. Stay secure and chat freely!
      </motion.p>

      <div className="p-6 bg-gray-800 shadow-lg rounded-2xl">
        <div className="flex flex-col items-center">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold mb-4">
            Start Messaging
          </button>
          <p className="text-sm text-gray-400">
            No data stored, complete privacy guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}
