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
  const [ref, {width: leaderboardWidth}] = useMeasure({debounce: 100});

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

      <div className="leaderboard-container" ref={ref}>
        <Leaderboard
          data={data}
          width={leaderboardWidth}
        />
      </div>

      <div className="button">
        <button onClick={refreshData}>Refresh Data</button>
      </div>
    </div>
  );
}

export default App;
