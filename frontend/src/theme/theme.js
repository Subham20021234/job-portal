 import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",  
      light: "#3B82F6",
      dark: "#1E40AF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0D9488",  
      light: "#14B8A6",
      dark: "#0F766E",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F9FAFB",  
      paper: "#FFFFFF",  
    },
    text: {
      primary: "#111827",  
      secondary: "#6B7280",  
    },
    divider: "#E5E7EB",
  },

  typography: {
    fontFamily: ["'Inter'", "sans-serif"].join(","),
    h1: { fontSize: "3.2rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "2.6rem", fontWeight: 700, lineHeight: 1.3 },
    h4: { fontSize: "1.8rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.9rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
  },

  shape: {
    borderRadius: 12,  
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: "0.3s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 10px 25px rgba(37,99,235,0.15)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: "all 0.25s ease",
        },
        containedPrimary: {
          background: "linear-gradient(90deg, #2563EB, #3B82F6)",
          "&:hover": {
            background: "linear-gradient(90deg, #1E40AF, #2563EB)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
