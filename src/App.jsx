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
        id: item.u_id, // Assuming u_id is a unique identifier for each entry
        label: `User ${item.u_id}`, // Label can be anything, here it's just 'User ' + u_id
        value: item[selectedCategory] // The value for the category 'duel_party_wins'
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
In this updated App component:

When the component mounts or the selected category changes, refreshData is called.
getData is assumed to fetch the leaderboard data for the selectedCategory.
The fetched data is transformed into the format the Leaderboard component expects.
The transformed data is set into the data state variable.
This data is then passed to the Leaderboard component, along with the width calculated by useMeasure.



User
label should be category
ChatGPT
Understood. If the label should be the category name, you can update the transformation like so:

javascript
Copy code
// ...

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

// ...
In this transformation:

label is set to the selectedCategory, with underscores replaced by spaces and converted to uppercase.
value continues to be the value for the selectedCategory.
id remains the u_id from each data item, ensuring each entry is unique.



User
now it loads but the dropdown selection doesnt work
ChatGPT
If the dropdown selection isn't changing the displayed data, we'll need to check a few things:

Verify that the onChange event for the select element correctly updates the selectedCategory state.
Ensure that the useEffect hook that calls refreshData is dependent on selectedCategory, so it runs whenever the category changes.
Make sure refreshData uses the latest selectedCategory when it is called.
Here's an example of how your App component might look, ensuring that the dropdown changes the data displayed:

jsx
Copy code
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Leaderboard from './Leaderboard';
import { getData } from './data';

const categories = [/* ... your categories ... */];

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [data, setData] = useState([]);

  // Define the function that fetches data and updates state
  const refreshData = useCallback(() => {
    getData(selectedCategory)
      .then(rawData => {
        const transformedData = rawData.map(item => ({
          id: item.u_id,
          label: selectedCategory.replace('_', ' ').toUpperCase(),
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
        <Leaderboard data={data} />
      </div>

      <div className="button">
        <button onClick={refreshData}>Refresh Data</button>
      </div>
    </div>
  );
}

export default App;
Make sure that the Leaderboard component is designed to re-render when its data prop changes. The D3 code inside the useEffect in Leaderboard must be set up to handle new data properly when it is received.

If this does not solve the issue, please provide more context or error messages so that I can assist you further.




User
import { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';

function Leaderboard({data, width}) {
  const d3Ref = useRef(null);

  // Constants
  const rowHeight = 60;
  const barHeight = 10;
  const marginText = 2;

  // Set the dimensions and margins of the graph
  const [height, setHeight] = useState(rowHeight * data.length ?? 0);

  useEffect(() => {
    setHeight(rowHeight * data.length);
    const height = rowHeight * data.length;

    // Add only once the root SVG with the correct margins
    const svg = d3.select(d3Ref.current);

    // Scales
    const maxValue = d3.max(data.map(d => +d.value)) ?? 1;
    const x = d3.scaleLinear().domain([0, maxValue]).range([5, width]);
    const y = d3.scaleLinear().domain([0, data.length]).range([0, height]);

    const fontSize = '1.1rem';

    const textColor = '#000000';
    const bgColor = '#d4d8df';
    const barColor = '#3d76c1'; 
    
    // Join the data
    // We use the ID to find rows of same data
    const g = svg.selectAll('g').data(data, d => d.id);

    // Initialization
    const gEnter = g.enter()
      .append('g')
        .attr('transform', `translate(0, ${y(data.length) + 500})`);

    // Append background rect as child
    gEnter
      .append('rect')
        .attr('class', 'bg')
        .attr('fill', bgColor)
        .attr('x', 0).attr('y', marginText)
        .attr('rx', 5).attr('ry', 5)
        .attr('height', barHeight);

    // Append main rect as child
    gEnter
      .append('rect')
        .attr('class', 'main')
        .attr('fill', barColor)
        .attr('x', 0).attr('y', marginText)
        .attr('rx', 5).attr('ry', 5)
        .attr('height', barHeight);

    // Append label text as child
    gEnter
      .append('text')
        .attr('class', 'label')
        .attr('font-size', fontSize)
        .attr('fill', textColor)
        .attr('x', 0)
        .attr('y', -5)
        .text(d => d.label);

    // Append value text as child
    gEnter
      .append('text')
        .attr('class', 'value')
        .attr('text-anchor', 'end')
        .attr('fill', textColor)
        .attr('font-size', fontSize)
        .attr('y', -5);

    // Update each g row, when data changes
    const gUpdate = g.merge(gEnter);
    gUpdate
      .transition()
        .ease(d3.easePoly)
        .duration(500)
        .attr('transform', (d, i) => `translate(0, ${y(i) + 30})`);

    // Update rect bg
    gUpdate
      .select('rect.bg')
      .attr('width', x(maxValue));

    // Update rect main
    gUpdate
      .select('rect.main')
      .transition()
        .ease(d3.easePolyOut)
        .duration(1000)
        .attr('width', d => x(d.value));
    
    // Update value text
    gUpdate
      .select('text.value')
      .text(d => d.value)
      .attr('x', x(maxValue));
    
    // Exit animation
    g.exit()
        .attr('opacity', 1)
      .transition()
        .ease(d3.easeLinear)
        .duration(200)
        .attr('transform', (d, i) => `translate(-50, ${y(i)})`)
        .attr('opacity', 0)
      .remove();
  }, [d3Ref, data, width, marginText, rowHeight, barHeight]);

  return (
    <svg
      width={width}
      height={height}
      ref={d3Ref}
    />
  );
}

export default Leaderboard;
ChatGPT
In your Leaderboard component, you're passing a width prop, but it's not clear where this width value is coming from in your parent component (App). You'll need to ensure that the width is properly set and passed down to Leaderboard. If width is not set, your bars won't render properly because the x-scale domain depends on it.

Here's what you can do to pass a width to your Leaderboard component:

First, ensure you have a width to pass down. You could use a static value, calculate it dynamically, or use the dimensions of the parent container.

Here's a modified App component that includes a width state and sets it based on the window size:

jsx
Copy code
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Leaderboard from './Leaderboard';
import { getData } from './data';

const categories = [/* ... your categories ... */];

function App() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [data, setData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth * 0.8); // For example, 80% of the window width

  // Adjust the width when the window is resized
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth * 0.8);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define the function that fetches data and updates state
  const refreshData = useCallback(() => {
    getData(selectedCategory)
      .then(rawData => {
        const transformedData = rawData.map(item => ({
          id: item.u_id,
          label: selectedCategory.replace('_', ' ').toUpperCase(),
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







