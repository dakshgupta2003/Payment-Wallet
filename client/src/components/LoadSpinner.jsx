import React from "react";
import { useSelector } from "react-redux";

const LoadSpinner = () => {
  const { loading } = useSelector((state) => state.loaders);
  return (
    <>
      {loading && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white"></div>
      </div>
      )}
    </>
  );
};

export default LoadSpinner;
