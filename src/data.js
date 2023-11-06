const DATA = []
  
// Return random data from a mock data array
export function getData(category) {
  const endpoint = `http://127.0.0.1:9998/leaderboard/${category}`; // replace with your actual endpoint
  return fetch(endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
}
