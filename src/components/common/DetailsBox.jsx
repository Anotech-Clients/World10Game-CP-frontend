import React, { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { CSSTransition } from "react-transition-group";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

// Add this style object at the top of your component
const slideStyles = {
  ".message-enter": {
    opacity: 0,
    transform: "translateY(20px)",
  },
  ".message-enter-active": {
    opacity: 1,
    transform: "translateY(0)",
    transition: "all 500ms ease-out",
  },
  ".message-exit": {
    opacity: 1,
    transform: "translateY(0)",
  },
  ".message-exit-active": {
    opacity: 0,
    transform: "translateY(-20px)",
    transition: "all 500ms ease-out",
  },
};

const DetailsBox = () => {
  const nodeRef = useRef(null);
  const navigate = useNavigate();

  const [inProp, setInProp] = useState(true);
  const [index, setIndex] = useState(0);

  const textArray = [
    "Welcome to the World 10 Game! Greetings, Gamers and Enthusiasts!",
    "The World 10 Game are here to provide excitement and fun.",
    "For your convenience and account safety, please ensure",
    "you fill in the genuine mobile number registered with your bank.",
    "Thank you for your cooperation and enjoy the games!",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setInProp(false);
      
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % textArray.length);
        setInProp(true);
      }, 500);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Grid
        item
        sx={{
          backgroundColor: "#323738",
          mt: "5px",
          mx: "12px",
          height: "50px",
          mb: "6px",
          borderRadius: "10px",
          padding: "2px 2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          ...slideStyles, // Add the animation styles
        }}
      >
        <IconButton>
          <VolumeUpIcon sx={{ color: "#24ee89", fontSize: "20px" }} />
        </IconButton>

        <Box 
          sx={{ 
            flex: 1, 
            overflow: "hidden", 
            padding: "0 10px",
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center"
          }}
        >
          <CSSTransition
            in={inProp}
            timeout={500}
            classNames="message"
            unmountOnExit
            nodeRef={nodeRef}
          >
            <Typography
              ref={nodeRef}
              sx={{
                color: "#ffffff",
                fontSize: "13px",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                textAlign: "left",
                overflow: "hidden",
                lineHeight: "1.3",
                WebkitLineClamp: 2,
                lineClamp: 2,
                textOverflow: "ellipsis",
                width: "100%",
                position: "absolute",
                left: 0,
                right: 0,
              }}
            >
              {textArray[index]}
            </Typography>
          </CSSTransition>
        </Box>

        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(90deg,#24ee89,#9fe871)",
            "&:hover": {
              background: "linear-gradient(90deg,#24ee89,#9fe871)",
            },
            borderRadius: "50px",
            fontSize: "11px",
            textTransform: "initial",
            padding: "7px 23px",
            color: "black",
            marginRight: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => navigate("/account/message")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            {/* <img
              src="/assets/icons/fire2.svg"
              alt="Placeholder"
              width={12}
              height={12}
              style={{ display: "inline-block" }}
            /> */}
            <Typography
              sx={{
                fontSize: "13px",
                color: "#221f2e",
                lineHeight: "1",
              }}
            >
              Detail
            </Typography>
          </Box>
        </Button>
      </Grid>
    </>
  );
};

export default DetailsBox;