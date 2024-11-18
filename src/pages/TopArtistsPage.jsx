// TopArtistsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Card, CardMedia } from "@mui/material";

const TopArtistsPage = () => {
  const { country } = useParams();
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
        const url = `https://ws.audioscrobbler.com/2.0/?method=geo.getTopArtists&country=${country}&api_key=${API_KEY}&format=json`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.message);
        }

        setArtists(data.topartists.artist.map(artist => artist.image[2]['#text']));
      } catch (err) {
        setError("Erro ao carregar as imagens dos artistas.");
      }
    };

    fetchTopArtists();
  }, [country]);

  return (
    <div>
      <h1>Artistas Populares em {country.toUpperCase()}</h1>
      {error && <p>{error}</p>}
      <Grid container spacing={3}>
        {artists.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                alt={`Artista ${index + 1}`}
                height="140"
                image={image}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default TopArtistsPage;
