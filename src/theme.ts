import { extendTheme } from "@chakra-ui/react";

export default extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "#fff",
      },
    },
  },
  colors: {
    basic: {
      white: "#fff",
      green: "#6fce6d",
      red: "#f05555",
      yellow: "#ECC94B",
      magenta: "#FF00FF",
      grey: "rgba(255,255,255,0.35)",
      purple: "#6155CD",
    },
    white: {
      200: "rgba(255,255,255,0.2)",
      400: "rgba(255,255,255,0.4)",
      600: "rgba(255,255,255,0.6)",
      800: "rgba(255,255,255,0.8)",
    },
    text: {},
    bg: { dark: "#141428", light: "#131325" },
  },
  components: {
    Button: {
      variants: {
        outline: {
          backgroundColor: "#6155CD",
          border: "none",
          _hover: {
            border: "1px solid #6155CD",
            background: "transparent",
          },
        },
      },
    },
  },
});
