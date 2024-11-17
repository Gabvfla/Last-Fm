import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { countries } from "../utils/countries"; // Arquivo com a lista de países e suas bandeiras.

const Home = () => {
  const [artist, setArtist] = useState("");
  const [country, setCountry] = useState("");
  const [result, setResult] = useState([]);
  const [artistImage, setArtistImage] = useState(null); // Estado para a imagem do artista
  const [error, setError] = useState(null);
  const [countryError, setCountryError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!artist.trim()) {
      setError("O campo não pode estar vazio.");
      return;
    }

    try {
      setError(null);
      const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;

      // Busca informações do artista, incluindo a imagem principal
      const artistInfoUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(
        artist
      )}&api_key=${API_KEY}&format=json`;

      const artistInfoResponse = await fetch(artistInfoUrl);

      if (!artistInfoResponse.ok) {
        throw new Error("Erro ao buscar informações do artista.");
      }

      const artistInfoData = await artistInfoResponse.json();
      const image =
        artistInfoData.artist &&
        artistInfoData.artist.image &&
        artistInfoData.artist.image.length > 3
          ? artistInfoData.artist.image[3]["#text"] // Tamanho grande
          : "https://via.placeholder.com/300"; // Placeholder se não houver imagem
      setArtistImage(image);

      // Busca as músicas mais populares do artista
      const topTracksUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${encodeURIComponent(
        artist
      )}&api_key=${API_KEY}&format=json`;

      const topTracksResponse = await fetch(topTracksUrl);

      if (!topTracksResponse.ok) {
        throw new Error("Erro ao buscar músicas do artista.");
      }

      const topTracksData = await topTracksResponse.json();
      const tracks = topTracksData.toptracks.track.slice(0, 5); // Limitar a 5 músicas

      // Busca a imagem do álbum para cada música usando track.getInfo
      const tracksWithAlbumImages = await Promise.all(
        tracks.map(async (track) => {
          try {
            const trackInfoUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(
              track.artist.name
            )}&track=${encodeURIComponent(
              track.name
            )}&api_key=${API_KEY}&format=json`;

            const trackInfoResponse = await fetch(trackInfoUrl);

            if (!trackInfoResponse.ok) {
              throw new Error("Erro ao buscar informações da música.");
            }

            const trackInfoData = await trackInfoResponse.json();

            return {
              name: track.name,
              artist: track.artist.name,
              albumImage:
                trackInfoData.track &&
                trackInfoData.track.album &&
                trackInfoData.track.album.image &&
                trackInfoData.track.album.image.length > 3
                  ? trackInfoData.track.album.image[3]["#text"] // Tamanho grande
                  : "https://via.placeholder.com/140", // Placeholder se não houver imagem
            };
          } catch {
            return {
              name: track.name,
              artist: track.artist.name,
              albumImage: "https://via.placeholder.com/140", // Placeholder em caso de erro
            };
          }
        })
      );

      setResult(tracksWithAlbumImages);
    } catch (err) {
      setError("Não foi possível buscar os dados. Tente novamente mais tarde.");
    }
  };

  const handleCountryRedirect = () => {
    if (!country.trim()) {
      setCountryError("Selecione um país.");
      return;
    }

    setCountryError(null);
    navigate(`/top-artists/${country}`);
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
        sx={{ display: "block", margin: "0 auto", mb: 4 }}
      >
        Buscar
      </Button>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ver Artistas Populares Do País
        </Typography>

        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel id="country-select-label">Selecione um País</InputLabel>
          <Select
            labelId="country-select-label"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            error={!!countryError}
          >
            {countries.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                <img
                  src={country.flag}
                  alt={`${country.name} flag`}
                  style={{ width: "20px", marginRight: "10px" }}
                />
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {countryError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {countryError}
          </Typography>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleCountryRedirect}
          disabled={!country}
          sx={{ display: "block", margin: "20px auto" }}
        >
          Selecionar
        </Button>
      </Box>
      {result.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Músicas Famosas:</Typography>
          {result.map((track, index) => (
            <Card
              key={index}
              sx={{ maxWidth: 345, margin: "20px auto" }}
            >
              <CardMedia
                component="img"
                alt={track.name}
                height="140"
                image={track.albumImage}
              />
              <CardContent>
                <Typography variant="h6">{track.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {track.artist}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Home;
