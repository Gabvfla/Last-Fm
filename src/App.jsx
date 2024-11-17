import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AlbumPage from "./pages/AlbumPage"; 

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
          <Route path="/album/:albumId" element={<AlbumPage />} /> 
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
