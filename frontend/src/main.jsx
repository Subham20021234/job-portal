import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.jsx";
import "./index.css";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import theme from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AnimatePresence mode="wait">
          <App />
        </AnimatePresence>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
