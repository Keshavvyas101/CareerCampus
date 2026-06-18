import React from "react";

const FeatureCard = ({icon, title, description}) => {
  return (
    <div className="flex flex-col items-center text-center bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-200 max-w-xs w-full">
      <div className="text-blue-600 text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
