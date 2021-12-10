import './App.css';
import Leaderboard from './Leaderboard';

const data = [
  { id: '', value: 1, label: 'Hello', },
  { id: '', value: 10, label: 'Hello', },
  { id: '', value: 5, label: 'Hello', },
  { id: '', value: 4, label: 'Hello', },
];
const width = 200;

function App() {
  return (
    <div className="app">
      <Leaderboard
        data={data}
        width={width}
      />
    </div>
  );
}

export default App;
