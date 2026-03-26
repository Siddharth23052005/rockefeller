import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import router from "./routes/router";

const theme = createTheme({
  palette: { mode: "dark" }
});

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
