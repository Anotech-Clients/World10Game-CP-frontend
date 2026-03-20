import React, { useState, useEffect, useContext } from "react"
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import BannerPosterContext from "../../context/BannerPosterContext"

const BannerCard = () => {
  const navigate = useNavigate();

  const {
    attendanceUrl,
    firstbonusUrl,
    avaiatorUrl,
    rebateUrl,
    refralbonusUrl,
    slotUrl,
    usdtUrl,
    telegramUrl,
    welcomeUrl,
    winstreakUrl,
    youtubeUrl,luckydaysUrl,
    realtimerebateUrl,luckyspinUrl,
    tournamentUrl
  } = useContext(BannerPosterContext)

  // Map context keys to URLs
  const contextMap = {
    avaitor: avaiatorUrl,
    usdt: usdtUrl,
    firstbonus: firstbonusUrl,
    attendance: attendanceUrl,
    rebate: rebateUrl,
    refralbonus: refralbonusUrl,
    slot: slotUrl,
    telegram: telegramUrl,
    welcome: welcomeUrl,
    winstreak: winstreakUrl,
    luckydays: luckydaysUrl,
    youtube: youtubeUrl,
    realtimerebate: realtimerebateUrl,
    
    luckyspin:luckyspinUrl,
    tournament: tournamentUrl
  }

  const cardData = [
    // {
    //   key: "tournament",
    //   fallback: "/assets/Banner/tournament.webp",
    //   text: "Tournaments",
    //   url: "/tournament",
    // },
    {
      key: "firstbonus",
      fallback: "/assets/Banner/ban_firstbonus.webp",
      text: "Deposit Bonus",
      url: "/activity/first-deposit-bonus",
    },
    // {
    //   key: "luckyspin",
    //   fallback: "/assets/Banner/ban_luckyspin.webp",
    //   text: "Lucky Spin Bonus",
    //   url: "/lucky-spinner",
    // },
    // {
    //   key: "winstreak",
    //   fallback: "/assets/winningStreak/winningStreakBanner.webp",
    //   text: "Winning Streak",
    //   url: "/activity/winning-streak",
    // },
    // {
    //   key: "luckydays",
    //   fallback: "/assets/lucky10days/lucky10DaysBanner.webp",
    //   text: "Lucky 10 Days",
    //   url: "/activity/lucky-10days",
    // },
    {
      key: "realtimerebate",
      fallback: "/assets/Banner/ban_realtimerebate.webp",
      text: "Real-Time Rebate",
      url: "/activity/activity-details/activity-3",
    },
    {
      key: "youtube",
      fallback: "/assets/Banner/ban_youtube.webp",
      text: "Youtube Creative Video Event",
      url: "/activity/activity-details/activity-4",
    },
    // {
    //   image: "/assets/Banner/ban_winstreak.webp",
    //   text: "Winstreak Bonus",
    //   url: "/activity/activity-details/activity-5",
    // },
    {
      key: "avaitor",
      fallback: "/assets/Banner/ban_avaitor.webp",
      text: "Aviator Bonus",
      url: "/activity/activity-details/activity-6",
    },
    {
      key: "usdt",
      fallback: "/assets/Banner/ban_usdt.webp",
      text: "USDT Bonus",
      url: "/activity/activity-details/activity-7",
    },
  ];

  return (
    <>
      <Grid
        mt={1}
        container
        spacing={1}
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
          width: "calc(100% - 20px)",
          marginBottom: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& .MuiGrid-item": {
            padding: 0, // Removes padding from all Grid items
          },
          "& .MuiGrid-item:last-child": {
            marginBottom: "2rem", // Add slight margin to the last card
          },
        }}
      >
        {cardData.map((card, index) => {
          const imageUrl = contextMap[card.key] || card.fallback

          return (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  borderRadius: "10px",
                  mt: 1,
                  cursor: "pointer",
                  border: "none", // Ensure no border is shown
                  boxShadow: "none", // Ensure no shadow is causing the issue
                  overflow: "hidden", // Ensure no overflow causes visual artifacts
                  backgroundColor: "#323738", // Match the background color
                }}
                onClick={() => navigate(card.url)} // Add onClick event here
              >
                <CardMedia
                  component="img"
                  height="auto"
                  image={imageUrl}
                  alt={`Image ${index + 1}`}
                  sx={{
                    display: "block", // Ensure the image is displayed as a block
                  }}
                />
                <CardContent
                  sx={{
                    backgroundColor: "#323738",
                    padding: "12px",
                    "&.MuiCardContent-root:last-child": {
                      paddingBottom: "12px",
                      "@media (max-width: 370px)": {
                        padding: "10px",
                      },
                    },
                    textAlign: "left",
                  }}
                >
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "calc(100% + 0.25%)", // Increase text size by 0.25%
                    }}
                  >
                    {card.text}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
        <Grid sx={{ width: "100%", my: 2, color:"white", opacity:0.5 }}>
        <Typography>No more</Typography>
      </Grid>
      </Grid>
    </>
  );
};

export default BannerCard;