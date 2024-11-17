import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";

const ArtistPage = () => {
  const { artistName } = useParams();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
        const url = `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(
          artistName
        )}&api_key=${API_KEY}&format=json`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erro ao buscar os dados do artista.");
        }

        const data = await response.json();
        setArtist(data.toptracks["@attr"].artist);
        setTracks(data.toptracks.track.slice(0, 5));
      } catch (err) {
        setError("Não foi possível carregar os dados do artista.");
      }
    };

    fetchArtistData();
  }, [artistName]);

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      {error && <Typography color="error">{error}</Typography>}

      {artist && (
        <Box>
          <Typography variant="h4">Artista: {artist}</Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Principais Músicas
          </Typography>

          {tracks.map((track) => (
            <Card key={track.mbid || track.name} sx={{ maxWidth: 345, margin: "20px auto" }}>
              <CardMedia
                component="img"
                alt={track.name}
                height="140"
                image={
                  track.image && track.image.length > 2
                    ? track.image[2]["#text"]
                    : "https://via.placeholder.com/140"
                }
              />
              <CardContent>
                <Typography variant="h6">{track.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Listeners: {track.listeners}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ArtistPage;