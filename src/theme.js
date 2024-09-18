import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#00A590",
            // main: '#6778EF',
            // light: '#c2c9f9'
        },
        lightGray: '#F5F7FF'
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "capitalize",
                    fontSize: '1rem',
                    boxShadow: "none",
                    "&:hover": {
                        textDecoration: "none",
                        boxShadow: "none",
                    },
                }
            }
        }
    },
    shadow: ["none", "0px 2px 4px rgba(0, 0, 0, 0.2)"]
})