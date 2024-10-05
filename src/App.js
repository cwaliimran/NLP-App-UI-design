import React, { useState } from 'react';
import './App.css';
import screens from './screens.json'; // Import JSON file

function App() {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  const handleNext = () => {
    setCurrentScreenIndex((prevIndex) => (prevIndex + 1) % screens.length);
  };

  const handlePrev = () => {
    setCurrentScreenIndex((prevIndex) => (prevIndex - 1 + screens.length) % screens.length);
  };

  // Dynamic renderer for any field or HTML element
  const renderElement = (element, key) => {
    const { type, label, ...rest } = element;

    switch (type) {
      case 'textBlock':
        return (
          <div className="text-block" key={key}>
            {label && <h3>{label}</h3>}
            <p>{rest.content}</p>
          </div>
        );
      case 'progressBar':
        return (
          <div className="progress-bar" key={key}>
            <label>{label}</label>
            <progress value={element.value} max={element.max}></progress>
          </div>
        );
      case 'button':
        return (
          <button className="action-btn" key={key} onClick={() => console.log(rest.onClick)}>
            {label}
          </button>
        );
      case 'link':
        return (
          <a className="action-link" href={rest.href} key={key}>
            {label}
          </a>
        );
      case 'text':
      case 'password':
      case 'email':
      case 'number':
        return (
          <div className="input-group" key={key}>
            {label && <label>{label}</label>}
            <input type={type} placeholder={label} {...rest} />
          </div>
        );
      case 'card':
        return (
          <div className="card" key={key}>
            <h3>{element.title}</h3>
            <p>{element.description}</p>
            <p><strong>Duration:</strong> {element.estimatedTime}</p>
            <p><strong>Difficulty:</strong> {element.difficulty}</p>
          </div>
        );
      default:
        return <div key={key}>Unsupported element: {type}</div>;
    }
  };

  // Function to render each screen based on the structure from JSON
  const HomeScreen = ({ screen }) => {
    return (
      <div className="App">
        <div className="mobile-frame">
          <h1>{screen.screenType.charAt(0).toUpperCase() + screen.screenType.slice(1)} Screen</h1>
          <p>{screen.description}</p>
          <form>
            {/* Render fields dynamically */}
            {screen.fields && screen.fields.map((field, index) => renderElement(field, index))}
          </form>
        </div>
        <div className="navigation">
          {screen.actions && screen.actions.map((action, index) => renderElement(action, index))}
        </div>
      </div>
    );
  };

  const currentScreen = screens[currentScreenIndex];

  return (
    <div className="App">
      <HomeScreen screen={currentScreen} />
      <div className="navigation">
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default App;
