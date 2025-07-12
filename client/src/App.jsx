import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    axios.get('/api/hello/')
      .then(res => setGreeting(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">ReWear</h1>
      <p>{greeting || 'Loading…'}</p>
    </div>
  );
}

export default App;
