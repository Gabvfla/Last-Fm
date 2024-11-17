import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";

const Home = () => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) {
      alert("O campo de busca não pode estar vazio!");
      return;
    }
    console.log("Buscando:", query);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Buscar Artistas no Last.fm
      </Typography>
      <TextField
        label="Digite o nome do artista"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSearch}
      >
        Buscar
      </Button>
    </Container>
  );
};

export default Home;
