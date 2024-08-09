import React from 'react';

const Loader = ({
  size = '2em',               // Size of the loader
  borderThickness = '0.2em',  // Thickness of the loader border
  color = '#2563eb',          // Color of the loader
  speed = '1s',               // Speed of the spinning animation
  fullScreen = true,          // Whether the loader should take up the full screen
  center = true,              // Whether the loader should be centered
  topBorderSize = '0.3em',    // Thickness of the rotating top border
}) => {
  const loaderStyle = {
    display: center ? 'flex' : 'inline-block',
    justifyContent: center ? 'center' : 'initial',
    alignItems: center ? 'center' : 'initial',
    height: fullScreen ? '100vh' : 'auto',
    width: fullScreen ? '100%' : 'auto',
    position: fullScreen ? 'fixed' : 'relative',  // Ensures it's positioned relative to the viewport
    top: fullScreen ? 0 : 'initial',
    left: fullScreen ? 0 : 'initial',
    margin: center ? '0 auto' : 'initial', // Center horizontally if not full-screen
  };

  const spinnerStyle = {
    border: `${borderThickness} solid rgba(0, 0, 0, 0.1)`,
    borderRadius: '50%',
    borderTop: `${topBorderSize} solid ${color}`, // Thickness of the rotating top border
    width: size,
    height: size,
    animation: `spin ${speed} linear infinite`,
  };

  return (
    <div style={loaderStyle}>
      <div style={spinnerStyle}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
