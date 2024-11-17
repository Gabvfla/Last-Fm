import React, { useState } from "react";
import { Button, TextField, Typography, Box, Card, CardContent, CardMedia } from "@mui/material";
import { Link } from "react-router-dom"; 

const Home = () => {
  const [album, setAlbum] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!album.trim()) {
      setError("O campo não pode estar vazio.");
      return;
    }

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

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Buscar Álbuns no Last.fm
      </Typography>

      <TextField
        label="Digite o nome do álbum"
        variant="outlined"
        value={album}
        onChange={(e) => setAlbum(e.target.value)}
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

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Resultados:</Typography>
          {result.length > 0 ? (
            result.map((album) => (
              <Card key={album.mbid} sx={{ maxWidth: 345, margin: "20px auto" }}>
                <CardMedia
                  component="img"
                  alt={album.name}
                  height="140"
                  image={album.image[2]["#text"]} 
                />
                <CardContent>
                  <Typography variant="h6">{album.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Artista: {album.artist}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ano de Lançamento: {album.year}
                  </Typography>
                  <Link to={`/album/${album.mbid}`}>
                    <Button variant="contained" color="secondary">Ver Álbum</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>Nenhum álbum encontrado.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Home;
