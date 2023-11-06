import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Leaderboard from './Leaderboard';
import { getData } from './data';
import useMeasure from 'react-use-measure';

const categories = [    
    "duel_party_wins",
    "duel_single_wins",
    "npc_wins",
    "first_party_create",
    "fishing_success",
    "breed_hexa",
    "breed_penta",
    "breed_success",
    "market_sold",
    "pokemon_caught",
    "shiny_caught",
    "shadow_caught",
    "chests_legend",
    "chests_mythic",
    "chests_rare",
    "chests_common",
    "redeems_used",
    "u_id",
    "missions",
    "votes",
    "donation_amount",
    "pokemon_normal",
    "pokemon_fire",
    "pokemon_water",
    "pokemon_grass",
    "pokemon_electric",
    "pokemon_ice",
    "pokemon_fighting",
    "pokemon_poison",
    "pokemon_ground",
    "pokemon_flying",
    "pokemon_psychic",
    "pokemon_bug",
    "pokemon_rock",
    "pokemon_ghost",
    "pokemon_dark",
    "pokemon_dragon",
    "pokemon_steel",
    "pokemon_fairy",
    "unown_event",
    "npc_duels",
    "duels_total",
    "pokemon_released",
    "dex_complete",
    "duel_inverse_wins",
    "shiny_bred",
    "shadow_bred",
    "chests_voucher",
    "market_purchased",
    "gym_wins",
    "easter_completed",
    "wombo_used",
    "breed_titan",
    "breed_quad",
    "duel_party_loses",
    "pokemon_released_ivtotal",
    "duel_total_xp"
]



function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [data, setData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth * 0.35); // For example, 80% of the window width

  // Adjust the width when the window is resized
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth * 0.4);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define the function that fetches data and updates state
  const refreshData = useCallback(() => {
    getData(selectedCategory)
      .then(rawData => {
        const transformedData = rawData.map(item => ({
          id: item.u_id,
          label: `${item.tnick} - (${item.u_id})`,
          value: item[selectedCategory]
        }));
        setData(transformedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setData([]);
      });
  }, [selectedCategory]);

  // Use an effect to fetch data when the selectedCategory changes
  useEffect(() => {
    refreshData();
  }, [selectedCategory, refreshData]);

  return (
    <div className="app">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category.replace('_', ' ').toUpperCase()}
          </option>
        ))}
      </select>

      <div className="leaderboard-container">
        <Leaderboard data={data} width={width} />
      </div>

      <div className="button">
        <button onClick={refreshData}>Refresh Data</button>
      </div>
    </div>
  );
}

export default App;







