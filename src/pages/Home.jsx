import React, { useState } from "react";
import { Button, TextField, Typography, Box, Card, CardContent, CardMedia, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
  const [album, setAlbum] = useState(""); 
  const [result, setResult] = useState(null); 
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const handleSearch = async () => {
    if (!album.trim()) {
      setError("O campo não pode estar vazio.");
      return;
    }

    setResult(null);

    try {
      setError(null); 
      const API_KEY = import.meta.env.VITE_LASTFM_API_KEY; 
      const url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(
        album
      )}&api_key=${API_KEY}&format=json`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar os dados.");
      }

      const data = await response.json();
      setResult(data.results.albummatches.album.slice(0, 5)); 
    } catch (err) {
      setError("Não foi possível buscar os dados. Tente novamente mais tarde.");
    }
  };

  const handleAlbumClick = (id) => {
    navigate(`/album/${id}`); 
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Buscar Álbuns no Last.fm
      </Typography>

      <TextField
        label="Digite o nome do álbum"
        variant="outlined"
        value={album}
        onChange={(e) => setAlbum(e.target.value)}
        error={!!error}
        helperText={error || ""}
        sx={{ mb: 2, width: { xs: "90%", sm: "300px" } }} 
      />
      <Button variant="contained" onClick={handleSearch}>Buscar</Button>

      {result && (
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 5 }}>
          {result.map((album) => (
            <Grid item xs={12} sm={6} md={4} key={album.mbid}>
              <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }} onClick={() => handleAlbumClick(album.mbid)}>
                <CardMedia
                  component="img"
                  alt={album.name}
                  height="300"
                  image={album.image[2]["#text"]}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {album.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {album.artist}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Home;
