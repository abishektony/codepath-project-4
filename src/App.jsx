import { useEffect, useState } from 'react';
import './App.css';

const API_KEY = "9ff37e06";
const MOVIE_IDS = [
  "tt0111161", // The Shawshank Redemption - Drama
  "tt0068646", // The Godfather - Crime, Drama
  "tt0071562", // The Godfather Part II - Crime, Drama
  "tt0468569", // The Dark Knight - Action, Crime, Drama
  "tt0050083", // 12 Angry Men - Drama
  "tt0109830", // Forrest Gump - Comedy, Drama, Romance
  "tt0110912", // Pulp Fiction - Crime, Drama
  "tt0167260", // The Lord of the Rings: The Return of the King - Adventure, Drama, Fantasy
  "tt0137523", // Fight Club - Drama
  "tt0120737", // The Lord of the Rings: The Fellowship of the Ring - Adventure, Drama, Fantasy
  "tt0108052", // Schindler's List - Biography, Drama, History
  "tt0088763", // Back to the Future - Adventure, Comedy, Sci-Fi
  "tt0133093", // The Matrix - Action, Sci-Fi
  "tt0110357", // The Lion King - Animation, Adventure, Drama
  "tt0245429", // Spirited Away - Animation, Adventure, Family
  "tt0120815", // Saving Private Ryan - Drama, War
  "tt0816692", // Interstellar - Adventure, Drama, Sci-Fi
  "tt0253474", // The Pianist - Biography, Drama, Music
  "tt0102926", // The Silence of the Lambs - Crime, Drama, Thriller
  "tt0114369", // Se7en - Crime, Drama, Mystery
  "tt0482571", // The Prestige - Drama, Mystery, Sci-Fi
  "tt0118799", // Life Is Beautiful - Comedy, Drama, Romance
  "tt0361748", // Inglourious Basterds - Adventure, Drama, War
  "tt2582802", // Whiplash - Drama, Music
  "tt0110413", // Léon: The Professional - Action, Crime, Drama
  "tt0081505", // The Shining - Drama, Horror
  "tt0038650", // It's a Wonderful Life - Drama, Family, Fantasy
  "tt0076759", // Star Wars: A New Hope - Action, Adventure, Fantasy
  "tt0082971", // Raiders of the Lost Ark - Action, Adventure
  "tt0095765", // Cinema Paradiso - Drama, Romance
  "tt0108778", // Goodfellas - Crime, Drama
  "tt0137523", // Fight Club - Drama
  "tt0047478", // Rear Window - Mystery, Thriller
  "tt0101410", // Braveheart - Drama, War
  "tt0190332", // The Green Mile - Drama, Fantasy
  "tt0075314", // A Clockwork Orange - Crime, Drama, Sci-Fi
  "tt0112573", // The Blair Witch Project - Horror, Mystery
  "tt0032551", // Casablanca - Drama, Romance, War
  "tt0393109", // The Aviator - Biography, Drama, History
  "tt1838556", // The Grand Budapest Hotel - Comedy, Drama, Mystery
  "tt0993846", // The Social Network - Biography, Drama
  "tt0268978", // Gladiator - Action, Adventure, Drama
  "tt0047478", // Rear Window - Mystery, Thriller
  "tt0457430", // Avatar - Action, Adventure, Sci-Fi
  "tt0145487", // American Beauty - Drama
  "tt0133093", // The Matrix - Action, Sci-Fi
  "tt1065073", // The Hangover - Comedy
  "tt1655442", // The Dark Knight Rises - Action, Crime, Drama
];

function App() {
  const [movie, setMovie] = useState(null);
  const [banList, setBanList] = useState([]);

  useEffect(() => {
    fetchMovie();
  }, []);

  const fetchMovie = async () => {
    try {
      let movieData;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        if (attempts >= maxAttempts) {
          alert("No more movies available with current bans.");
          return;
        }
        attempts++;

        const randomId = MOVIE_IDS[Math.floor(Math.random() * MOVIE_IDS.length)];
        const response = await fetch(`https://www.omdbapi.com/?i=${randomId}&apikey=${API_KEY}`);
        movieData = await response.json();

      } while (
        movieData.Genre?.split(', ').some((g) => banList.includes(g)) ||
        banList.includes(movieData.Year) ||
        movieData.Country?.split(', ').some((c) => banList.includes(c))
      );

      setMovie(movieData);
    } catch (error) {
      console.error('Error fetching movie:', error);
    }
  };

  const handleBan = (item) => {
    if (banList.includes(item)) {
      alert(`You have already banned: ${item}`);
      return;
    }
    setBanList((prev) => [...prev, item]);
  };

  const handleUnban = (item) => {
    setBanList((prev) => prev.filter((banned) => banned !== item));
  };

  return (
    <div className="container">
      <h1>Veni Vici - Discover a Movie!</h1>
      {movie && (
        <div className="content">
          <img src={movie.Poster} alt={movie.Title} />
          <h2>{movie.Title}</h2>
          <p className="genre">
            Genre: {movie.Genre?.split(', ').map((g) => (
              <span key={g} onClick={() => handleBan(g)}>
                {g} </span>
            ))}
          </p>
          <p>Year: <span onClick={() => handleBan(movie.Year)}>{movie.Year}</span></p>
          <p>Country: {movie.Country.split(', ').map((g) => ( <span onClick={() => handleBan(g)}>{g} </span>))}</p>
        </div>
      )}
      <button onClick={fetchMovie}>Discover</button>
      <h2>Ban List</h2>
      <ul>
        {banList.map((item, index) => (
          <li key={index} onClick={() => handleUnban(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
