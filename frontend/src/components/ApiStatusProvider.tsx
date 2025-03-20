"use client";

import React, { useEffect, useState } from "react";
import { checkApiAvailability } from "@/services/api";

export const ApiStatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isApiAvailable, setIsApiAvailable] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const available = await checkApiAvailability();
        setIsApiAvailable(available);
      } catch (error) {
        setIsApiAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkApi();
  }, []);

  return (
    <>
      {isChecking && (
        <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-1">
          Checking API availability...
        </div>
      )}

      {!isChecking && !isApiAvailable && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-1">
          Using local data (API unavailable)
        </div>
      )}

      {children}
    </>
  );
};
