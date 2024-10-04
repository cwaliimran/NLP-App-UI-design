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

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'password':
        return (
          <div className="input-group" key={field.label}>
            <label>{field.label}</label>
            <input type={field.type} placeholder={field.label} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderAction = (action) => {
    switch (action.type) {
      case 'button':
        return <button className="action-btn" key={action.label}>{action.label}</button>;
      case 'link':
        return <a className="action-link" href="#" key={action.label}>{action.label}</a>;
      default:
        return null;
    }
  };

  const currentScreen = screens[currentScreenIndex];

  return (
    <div className="App">
      <div className="mobile-frame">
        <h1>{currentScreen.screenType.charAt(0).toUpperCase() + currentScreen.screenType.slice(1)} Screen</h1>
        <p>{currentScreen.description}</p>
        <form>
          {currentScreen.fields.map((field) => renderField(field))}
          <div className="actions">
            {currentScreen.actions.map((action) => renderAction(action))}
          </div>
        </form>
      </div>
      <div className="navigation">
        <button onClick={handlePrev}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default App;
