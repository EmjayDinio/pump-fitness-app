// src/utils/imageHelpers.js
export const getOptimizedImageUri = (uri, width = 300, height = 200) => {
  // Add image optimization service if using external images
  if (uri && uri.includes('example.com')) {
    return `${uri}?w=${width}&h=${height}&fit=crop&auto=compress`;
  }
  return uri;
};

// Use React.memo for components that don't need frequent re-renders
// src/components/workout/WorkoutCard.js
import React from 'react';
// ... other imports

export default React.memo(function WorkoutCard({ workout, onPress }) {
  // ... component code
});