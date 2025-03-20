"use client";

import React, { useState, useEffect } from "react";
import {
  useLocalData,
  resetApiStatus,
  checkApiAvailability,
} from "../services/api";

export const ApiToggle: React.FC = () => {
  const [usingLocal, setUsingLocal] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const apiAvailable = await checkApiAvailability();
      setUsingLocal(!apiAvailable);
    };

    checkStatus();
  }, []);

  const handleToggle = () => {
    if (usingLocal) {
      resetApiStatus();
      checkApiAvailability().then((available) => {
        setUsingLocal(!available);
      });
    } else {
      useLocalData();
      setUsingLocal(true);
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm">Data Source:</span>
      <button
        onClick={handleToggle}
        className={`px-3 py-1 text-sm rounded ${
          usingLocal
            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {usingLocal ? "Using Local Data" : "Using API"}
      </button>
    </div>
  );
};
