import React, { useState, useMemo } from "react";
import { Button, TextField, Typography, Box, Card, CardContent, CardMedia, Grid } from "@mui/material";
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

  const memoizedResult = useMemo(() => result, [result]);

  return (
    <Box sx={{ 
      fontFamily: "National",
      textAlign: "center", 
      mt: 5,
      color: "white",
      backgroundColor: "#d92323",
      padding: "120px",
      borderRadius: "10px" }}>
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
        sx={{
          mb: 2,
          width: { xs: "100%", sm: "300px"},
          "& .MuiInputLabel-root": { fontSize: "1.2rem", color: "white", opacity: "70%", fontFamily: "National" },
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        sx={{
          display: "block",
          margin: "0 auto",
          padding: "0.8rem 2rem",
          fontWeight: "bold",
          borderRadius: "8px",
          backgroundColor: "black",
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "white",
            color: "black"
          },
        }}
      >
        Buscar
      </Button>

      {memoizedResult.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Resultados:</Typography>
          <Grid container spacing={4} justifyContent="center">
            {memoizedResult.map((artist) => (
              <Grid item xs={12} sm={6} md={4} key={artist.mbid || artist.name}>
                <Card sx={{ 
                  maxWidth: 345, 
                  boxShadow: 3, 
                  borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    alt={artist.name}
                    height="140"
                    image={
                      artist.image && artist.image.length > 2 && artist.image[2]["#text"]
                        ? artist.image[2]["#text"]
                        : "https://via.placeholder.com/140"
                    }
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ backgroundColor: "#fafafa", padding: "1.5rem" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {artist.name}
                    </Typography>
                    <Link to={`/artist/${artist.name}`}>
                      <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
                        Ver Artista
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Home;
