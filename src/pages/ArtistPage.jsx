import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";

const ArtistPage = () => {
  const { artistName } = useParams();
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

        const tracksWithAlbumInfo = await Promise.all(
          data.toptracks.track.slice(0, 5).map(async (track) => {
            try {
              const trackInfoUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(
                artistName
              )}&track=${encodeURIComponent(track.name)}&api_key=${API_KEY}&format=json`;

              const trackInfoResponse = await fetch(trackInfoUrl);
              const trackInfoData = await trackInfoResponse.json();

              return {
                name: track.name,
                artist: track.artist.name,
                albumImage:
                  trackInfoData.track &&
                  trackInfoData.track.album &&
                  trackInfoData.track.album.image &&
                  trackInfoData.track.album.image.length > 3
                    ? trackInfoData.track.album.image[3]["#text"] 
                    : "https://via.placeholder.com/140", 
              };
            } catch {
              return {
                name: track.name,
                artist: track.artist.name,
                albumImage: "https://via.placeholder.com/140",
              };
            }
          })
        );

        setTracks(tracksWithAlbumInfo);
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
            <Card key={track.name} sx={{ maxWidth: 345, margin: "20px auto" }}>
              <CardMedia
                component="img"
                alt={track.name}
                height="140"
                image={track.albumImage}
              />
              <CardContent>
                <Typography variant="h6">{track.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Artista: {track.artist}
                </Typography>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4 }}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ArtistPage;
