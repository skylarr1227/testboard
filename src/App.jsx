import React, { useState, useEffect } from 'react';
import './App.css';
import Leaderboard from './Leaderboard';
import { getData } from './data';
import useMeasure from 'react-use-measure';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [data, setData] = useState([]);

  // Fetch leaderboard data based on the selected category
  const refreshData = useCallback(() => {
    getData(selectedCategory).then(d => setData(d || []));
  }, [selectedCategory]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="app">
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category.replace('_', ' ').toUpperCase()}
          </option>
        ))}
      </select>

      <div className="leaderboard-container">
        <Leaderboard data={data} />
      </div>

      <div className="button">
        <button onClick={refreshData}>Refresh Data</button>
      </div>
    </div>
  );
}

export default App;
