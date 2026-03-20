import React, { useState, useEffect,useContext } from "react";
import { Box } from "@mui/material";
import BannerPosterContext from "../../context/BannerPosterContext"

// Update image paths, assuming the images are in the 'public/assets/Banner/' directory
const images = [
  {
    key: "welcome",
    fallback: "/assets/Banner/welcome-2.webp",
    txt: "Our customer service never sends a link to the member, if you received a link from someone else it might be a scam.",
  },
  {
    key: "agent",
    fallback: "/assets/Banner/agent-2.webp",
    txt: "Welcome to our World 10 Game our customer service never sends a link to the member.",
  },
  {
     key: "attendance",
      fallback: "/assets/Banner/attendance-2.webp",
    txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
  },
  {
    key:"youtube",
    fallback: "/assets/Banner/ban_youtube.webp",
    txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
  },
  {
    key: "luckyspin",
    fallback: "/assets/Banner/luckyspin-2.webp",
    txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
  },
  {
    key: "winstreak",
      fallback: "/assets/Banner/winstreak-2.webp",
    txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
  },
  {
    key: "avaitor",
      fallback: "/assets/Banner/aviator-3.webp",
    txt: "Thankyou for visting our website and your value time,our website deals with many features,hope you enjoy",
  },
 
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    attendanceUrl,
    rebateUrl,
    refralbonusUrl,
    slotUrl,
    telegramUrl,
    welcomeUrl,
    winstreakUrl,
    youtubeUrl,
    realtimerebateUrl,luckyspinUrl,avaiatorUrl
  } = useContext(BannerPosterContext)

  // Map context keys to URLs
  const contextMap = {
    attendance: attendanceUrl,
    rebate: rebateUrl,
    refralbonus: refralbonusUrl,
    slot: slotUrl,
    telegram: telegramUrl,
    welcome: welcomeUrl,
    winstreak: winstreakUrl,
    youtube: youtubeUrl,
    realtimerebate: realtimerebateUrl,
     luckyspin:luckyspinUrl,
     avaitor:avaiatorUrl
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Auto-slide every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{width:"100%",mt:2}}>
    <Box
  sx={{
    position: "relative",
    maxWidth: "800px", // Maximum width on larger screens
    height: "190px", // Default height
    margin: "0 auto", // Auto for horizontal centering
    overflow: "hidden", // Prevent extra images from being visible

    marginLeft: "10px", // Left margin
    marginRight: "10px", // Right margin
    backgroundColor:"#232626 ",
  }}
>
  {/* Image Container */}
  <Box
    sx={{
      display: "flex",
      transition: "transform 0.5s ease-in-out",
      // borderRadius:"10px",
      transform: `translateX(-${currentIndex * 100}%)`, // Ensure only the current image is in view
    }}
  >
    {images.map((image, index) => {
            const contextUrl = contextMap[image.key] // Check for context override
            const src = contextUrl || image.fallback

            return(
              <Box
                key={index}
                component="img"
                src={src} // Use the image path from the array
                alt={`Slide ${index + 1}`}
                sx={{
                  width: "100%",
                  borderRadius: "10px",
                  height: "150px",
                  backgroundPosition:"center",
                  objectFit: "cover",
                  backgroundSize:"cover",
                  flexShrink: 0, // Prevent the images from shrinking
                }}
              />
            )
          })}
  </Box>

  {/* Dot Indicators */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      position: "absolute",
      bottom: "16px",
      left: "50%",
      transform: "translateX(-50%)",
      gap: "18px",
    }}
  >
    {images.map((_, index) => (
      <Box
        key={index}
        onClick={() => setCurrentIndex(index)}
        sx={{
          width: currentIndex === index ? "11px" : "4px",
          height: currentIndex === index ? "4px" : "4px",
          borderRadius: "50px",
          backgroundColor: currentIndex === index ? "#24ee89" : "#656565",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
      />
    ))}
  </Box>
</Box>
</Box>
  

  );
};

export default ImageSlider;
