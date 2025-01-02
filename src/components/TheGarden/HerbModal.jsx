import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const HerbModal = ({ isOpen, onClose, herb }) => {
  if (!isOpen) return null;

  const speakAloud = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      speech.rate = 1; // Adjust the speed (default is 1)
      window.speechSynthesis.speak(speech);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <div className="p-6">
              <img
                src={herb.image}
                alt={herb.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {herb.name}
              </h2>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <strong>Common Name:</strong>{" "}
                <span className="text-gray-700">{herb.commonName}</span>
              </h3>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <strong>Scientific Name:</strong>{" "}
                <span className="text-gray-600">{herb.scientificName}</span>
              </h3>

              <p className="text-gray-600 mb-6">{herb.description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Benefits
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {herb.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-600">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Interesting Facts
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {herb.facts.map((fact, index) => (
                    <li key={index} className="text-gray-600">
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Health Applications
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {herb.healthApplications.map((application, index) => (
                    <li key={index} className="text-gray-600">
                      {application}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chemical Composition
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {herb.chemicalComposition.map((compound, index) => (
                    <li key={index} className="text-gray-600">
                      {compound}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Recipes and Uses
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {herb.recipesAndUses.map((recipe, index) => (
                    <li key={index} className="text-gray-600">
                      {recipe}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cultivation Information
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li className="text-gray-600">
                    Soil Type: {herb.cultivationInfo.soilType}
                  </li>
                  <li className="text-gray-600">
                    Sunlight: {herb.cultivationInfo.sunlight}
                  </li>
                  <li className="text-gray-600">
                    Watering: {herb.cultivationInfo.watering}
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cultivation Links
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {herb.cultivationLinks.map((link, index) => (
                    <li key={index} className="text-gray-600">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Educational Links
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {herb.educationLinks.map((link, index) => (
                    <li key={index} className="text-gray-600">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cultural Significance
                </h3>
                <p className="text-gray-600">{herb.culturalSignificance}</p>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Close
                </button>
                <button
                  onClick={stopSpeaking}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Stop Speaking
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() =>
                    speakAloud(
                      herb.scientificName + ".       " + herb.description
                    )
                  }
                >
                  Speak Aloud
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
