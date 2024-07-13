import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [breeds, setBreeds] = useState({});
  const [image, setImage] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('Random');
  const [imageName, setImageName] = useState('Random');

  // Fetch list of dog breeds
  const getBreeds = async () => {
    try {
      let res = await axios.get('https://dog.ceo/api/breeds/list/all');
      setBreeds(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch a random dog image
  const getRandomImage = async () => {
    try {
      let res = await axios.get('https://dog.ceo/api/breeds/image/random');
      setImage(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch a random image for the selected breed
  const getBreedImage = async (breed) => {
    try {
      let res = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
      setImage(res.data.message);
      setImageName(breed);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch breeds and a random image on component mount
  useEffect(() => {
    getBreeds();
    getRandomImage();
    const interval = setInterval(() => {
      getRandomImage();
    }, 20000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle breed selection
  const handleBreedChange = (e) => {
    const breed = e.target.value;
    setSelectedBreed(breed);
    if (breed === 'Random') {
      getRandomImage();
    } else {
      getBreedImage(breed);
    }
  };

  // Handle fetching next image
  const handleNextImage = () => {
    if (selectedBreed === 'Random') {
      getRandomImage();
      const breedNames = Object.keys(breeds);
      const randomBreed = breedNames[Math.floor(Math.random() * breedNames.length)];
      setImageName(randomBreed);
    } else {
      const breedNames = Object.keys(breeds);
      const randomBreed = breedNames[Math.floor(Math.random() * breedNames.length)];
      setImageName(randomBreed)
      getBreedImage(randomBreed);
    }
  };

  return (
    <div className="App">
      <div>
        {Object.keys(breeds).length > 0 && (
          <div>
            <select onChange={handleBreedChange}>
              <option value="Random">Auto Random selected </option>
              {Object.keys(breeds).map((breed, i) => (
                <option key={i} value={breed}>{breed}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <h2>{selectedBreed !== 'Random' ? `${selectedBreed} Selected Image` : 'Random Dog Image'}</h2>
          {image && <img src={image} alt="Dog" width={200} height={200} />}
          <p>Current Image Name: {imageName}</p>
        </div>
        <button onClick={handleNextImage}>Next</button>
      </div>
    </div>
  );
}

export default App;
