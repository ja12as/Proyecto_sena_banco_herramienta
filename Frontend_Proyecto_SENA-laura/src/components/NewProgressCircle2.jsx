import React from "react";
import { Box } from "@mui/material";

const NewProgressCircle2 = ({ progress, size = 70 }) => {
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;

    const validProgress = isNaN(progress) || progress < 0 ? 0 : progress > 100 ? 100 : progress;

    const offsetGreen = circumference - (validProgress / 100) * circumference;
  
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
            stroke="#f44336" 
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset="0" // Todo consumido inicialmente
          />
          <circle
            stroke="#4caf50" 
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offsetGreen} 
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} 
          />
        </svg>
      </Box>
    );
  };

export default NewProgressCircle2
