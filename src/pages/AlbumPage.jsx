import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import { Box, Typography, Card, CardContent, CardMedia, Grid, IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const AlbumPage = () => {
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
        const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&mbid=${id}&format=json`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do álbum.");
        }
        const data = await response.json();
        setAlbumDetails(data.album);
      } catch (err) {
        setError("Não foi possível carregar os dados do álbum.");
      }
    };

    fetchAlbumDetails();
  }, [id]);

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!albumDetails) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {albumDetails.name} - {albumDetails.artist}
      </Typography>
      <Card sx={{ maxWidth: 500, margin: "0 auto" }}>
        <CardMedia
          component="img"
          alt={albumDetails.name}
          height="300"
          image={albumDetails.image[2]["#text"]}
        />
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Ano de Lançamento: {albumDetails.year}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Gênero: {albumDetails.tags?.tag?.[0]?.name || "Desconhecido"}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Músicas:
        </Typography>
        {albumDetails.tracks.track.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {albumDetails.tracks.track.map((track) => (
              <Grid item xs={12} sm={6} md={4} key={track.url}>
                <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {track.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Duração: {track.duration}s
                    </Typography>
                    <IconButton
                      color="primary"
                      onClick={() => window.open(track.url, "_blank")}
                    >
                      <PlayCircleOutlineIcon /> Ouvir
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>Nenhuma música encontrada.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AlbumPage;
