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
  const [selectedCategory, setSelectedCategory] = useState('duel_party_wins');
  const [data, setData] = useState([]);
  const [ref, { width: leaderboardWidth }] = useMeasure({ debounce: 100 });

  const refreshData = () => {
  getData(selectedCategory).then(rawData => {
    // Transform the data to match the expected format for the Leaderboard component
    const transformedData = rawData.map(item => ({
      id: item.u_id, // u_id is a unique identifier for each entry
      label: selectedCategory.replace('_', ' ').toUpperCase(), // Category name as the label
      value: item[selectedCategory] // The value for the selected category
    }));

    setData(transformedData); // Update state with transformed data
  }).catch(error => {
    console.error('Error fetching data:', error);
    setData([]); // Reset the data on error
  });
};

  useEffect(() => {
    refreshData();
  }, [selectedCategory]); // Refresh data when the selected category changes

  return (
    <div className="app">
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        {/* Assuming you have other categories to select from */}
      </select>

      <div className="leaderboard-container" ref={ref}>
        <Leaderboard data={data} width={leaderboardWidth} />
      </div>

      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
}

export default App;
