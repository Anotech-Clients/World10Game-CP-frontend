import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
// import ChristmasEffects from "../effects/Snowflakes";

const Mobile = ({ children }) => {
  useEffect(() => {
    // Disable scrolling on the document body
    document.body.style.overflow = "hidden";

    return () => {
      // Enable scrolling on the document body when the component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#9195a3"
    >
      <Container
        maxWidth={isSmallScreen ? false : "xs"}
        sx={{
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          padding: 0, // Remove default padding
          margin: 0, // Remove default margin
          width: "100%", // Full width on small screens
          maxWidth: "100%", // Full width on small screens
        }}
      >
        <Box
          bgcolor="#232626"
          textAlign="center"
          minHeight="100%"
          maxHeight="100vh"
          width="100%" // Full width on small screens
          paddingX={0} // Remove padding from left and right sides
          sx={{
            overflowY: "auto", // Enable scrolling in the inner box
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar in the inner box
            },
            wordWrap: "break-word", // Break the word and wrap onto the next line
            position: "relative",
          }}
        >
          {/* <ChristmasEffects numberOfSnowflakes={50} /> */}
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Mobile;
