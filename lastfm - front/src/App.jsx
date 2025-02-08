import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArtistPage from "./pages/ArtistPage"; 

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artist/:artistName" element={<ArtistPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
);
};

export default App;