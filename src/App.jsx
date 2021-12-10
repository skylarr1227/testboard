import './App.css';
import Leaderboard from './Leaderboard';
import { getData } from './data';
import { useEffect, useState, useCallback } from 'react';
const width = 200;

function App() {
  const [data, setData] = useState([]);

  // Update the array
  const resfreshData = useCallback(() => getData().then(d => setData(d)));

  // Fill the data array at the page load
  useEffect(() => resfreshData(), []);

  return (
    <div className="app">
      <Leaderboard
        data={data}
        width={width}
      />

      <div className="button">
        <button onClick={() => resfreshData()}>Refresh Data</button>
      </div>
    </div>
  );
}

export default App;
