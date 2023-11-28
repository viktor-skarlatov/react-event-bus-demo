import logo from './logo.svg';
import './App.css';
import { useEventBus } from './context/useEventBus';
import { Button } from './Button';
import { PressCount } from './PressCount';
import { ButtonEvents } from './events';
import { useCallback, useMemo, useState } from 'react';

function App() {
  const [isCountVisible, setIsCountVisible] = useState(true);

  const onHideButton = useCallback(() => {
    setIsCountVisible(false);
  }, []);

  const subs: ButtonEvents = useMemo(() => ({
    "hide-button": onHideButton,
  }), [onHideButton]);

  useEventBus<ButtonEvents>(subs);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          { isCountVisible ? <PressCount /> : null }
        </div>
        <div>
          <Button />
        </div>
      </header>
    </div>
  );
}

export default App;
