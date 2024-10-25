import React from "react";
import { Box } from "@mui/material";

const NewProgressCircle3 = ({ progress, condicion, size = 70 }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;

  const validProgress =
    isNaN(progress) || progress < 0 ? 0 : progress > 100 ? 100 : progress;

  const offsetGreen = circumference - (validProgress / 100) * circumference;

  const getColorByCondition = (condicion) => {
    switch (condicion) {
      case "BUENO":
        return "#4caf50";
      case "REGULAR":
        return "#ff9800";
      case "MALO":
        return "#f44336";
      default:
        return "#e6e6e6";
    }
  };

  const strokeColor = getColorByCondition(condicion);

  return (
    <Box
      sx={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg width={size} height={size}>
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth="10"
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offsetGreen}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </Box>
  );
};

export default NewProgressCircle3;
