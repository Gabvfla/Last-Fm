import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";

const AlbumPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
        const url = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&mbid=${albumId}&api_key=${API_KEY}&format=json`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar dados do álbum.");
        }

        const data = await response.json();
        setAlbum(data.album);
        setSongs(data.album.tracks.track);
      } catch (err) {
        setError("Não foi possível carregar os dados do álbum.");
      }
    };

    fetchAlbumData();
  }, [albumId]);

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      {error && <Typography color="error">{error}</Typography>}

      {album && (
        <Box>
          <Typography variant="h4">{album.name}</Typography>
          <Typography variant="h6">Artista: {album.artist}</Typography>
          <Typography variant="body1">Ano: {album.year}</Typography>

          <Card sx={{ maxWidth: 345, margin: "20px auto" }}>
            <CardMedia
              component="img"
              alt={album.name}
              height="200"
              image={album.image[2]["#text"]}
            />
            <CardContent>
              <Typography variant="h6">Faixas:</Typography>
              {songs.map((song) => (
                <Typography key={song.url} variant="body2">
                  {song.name}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AlbumPage;
