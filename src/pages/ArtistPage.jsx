import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from "@mui/material";

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

  const memoizedTracks = useMemo(() => tracks, [tracks]);

  return (
    <Box sx={{ 
      fontFamily: "National",
      textAlign: "center", 
      mt: 5,
      color: "white",
      backgroundColor: "#d92323",
      padding: "120px",
      borderRadius: "10px" }}>
      {error && <Typography color="error">{error}</Typography>}

      {artist && (
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Artista: {artist}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Principais Músicas
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {memoizedTracks.map((track) => (
              <Grid item xs={12} sm={6} md={4} key={track.name}>
                <Card sx={{ maxWidth: 345, boxShadow: 3, borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    alt={track.name}
                    height="180"
                    image={track.albumImage}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ backgroundColor: "#fafafa", padding: "1.5rem" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {track.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Artista: {track.artist}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            sx={{
              display: "block",
              margin: "50px auto",
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
