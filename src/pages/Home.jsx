import React, { useState } from "react";
import { Button, TextField, Typography, Box, Card, CardContent, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  const [artist, setArtist] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!artist.trim()) {
      setError("O campo não pode estar vazio.");
      return;
    }

    try {
      setError(null);
      const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
      const url = `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(
        artist
      )}&api_key=${API_KEY}&format=json`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar os dados.");
      }

      const data = await response.json();
      setResult(data.results.artistmatches.artist.slice(0, 5));
    } catch (err) {
      setError("Não foi possível buscar os dados. Tente novamente mais tarde.");
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Buscar Artistas no Last.fm
      </Typography>

      <TextField
        label="Digite o nome do artista"
        variant="outlined"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        error={!!error}
        helperText={error || ""}
        sx={{ mb: 2, width: "300px" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        sx={{ display: "block", margin: "0 auto" }}
      >
        Buscar
      </Button>

      {result.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Resultados:</Typography>
          {result.map((artist) => (
            <Card key={artist.mbid || artist.name} sx={{ maxWidth: 345, margin: "20px auto" }}>
              <CardMedia
                component="img"
                alt={artist.name}
                height="140"
                image={
                  artist.image && artist.image.length > 2 && artist.image[2]["#text"]
                    ? artist.image[2]["#text"]
                    : "https://via.placeholder.com/140"
                }
              />
              <CardContent>
                <Typography variant="h6">{artist.name}</Typography>
                <Link to={`/artist/${artist.name}`}>
                  <Button variant="contained" color="secondary">Ver Artista</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Home;
