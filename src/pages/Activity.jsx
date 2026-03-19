import React, { useState, useEffect } from "react";
import Mobile from "../components/layout/Mobile";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import BottomNavigationArea from "../components/common/BottomNavigation";
import attendanceBonusImg from "../assets/activity/attendanceBonus.webp";
import giftImg from "../assets/activity/giftRedeem.webp";
import ActivityIcons from "../components/activity/ActivityIcons";
import BannerCard from "../components/activity/BannerCard";
import Champion from "../components/home/Champion";
import LoadingLogo from "../components/utils/LodingLogo";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Activity = () => {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);
  const navigate = useNavigate();
  const [logoLoading, setLogoLoading] = useState(true);
  const navigateToPage2 = () => {
    navigate("/gift-coupon");
  };
  const navigateToPage3 = () => {
    navigate("/attendance");
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setLogoLoading(false); // Hide loading after 2 seconds
    }, 1000);

    return () => clearTimeout(timer); // Cleanup
  }, []);

  return (
    <>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          {logoLoading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
              }}
            >
              <LoadingLogo websiteName="World 10 Game" />
            </div>
          )}
          <Box flexGrow={1} sx={{ backgroundColor: "#232626" }}>
            <Grid
              item
              xs={12}
              textAlign="center"
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "5px 0",
              }}
            >
              {/* BACK BUTTON */}
              <ArrowBackIosNewIcon
                onClick={() => navigate(-1)}
                style={{
                  color: "white",
                  fontSize: "20px",
                  position: "absolute",
                  left: "16px",
                  cursor: "pointer",
                }}
              />

              {/* LOGO */}
              <img
                src="/assets/logo/colorLogo.webp"
                alt="logo"
                style={{ width: "80px", margin: "0 auto" }}
              />
            </Grid>

            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                width: "100%",
                background: "#323738",
                padding: "0px 16px 42px 16px",
                color: "white",
                mb: 2,
              }}
            >
              <Grid
                item
                xs={6}
                textAlign="left"
                sx={{
                  fontSize: "18px",
                  mt: 1.5,
                  "@media (max-width: 355px)": {
                    fontSize: "16px",
                  },
                }}
              >
                <span style={{ fontWeight: "500" }}>Activity</span>
              </Grid>

              <Grid item xs={12} textAlign="Left" sx={{ mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    "@media (max-width: 355px)": {
                      fontSize: "10px",
                    },
                  }}
                >
                  Please remember to follow the event page
                  <br />
                  We will launch user feedback activities from time to time
                </Typography>
              </Grid>
            </Grid>

            {/* //content */}

            <ActivityIcons />

            <Grid
              mt={0.5}
              container
              spacing={1} // Restore spacing to 1 to maintain alignment
              sx={{
                marginLeft: "0px",
                marginRight: "auto",
                width: "98%",
              }}
            >
              <Grid item xs={6}>
                <Card
                  onClick={navigateToPage2}
                  sx={{
                    borderRadius: "10px",
                    border: "none", // Ensure no border is shown
                    boxShadow: "none", // Ensure no shadow is causing the issue
                    overflow: "hidden", // Ensure no overflow causes visual artifacts
                    backgroundColor: "#323738", // Match the background color
                    margin: "0", // Remove any default margin
                    padding: "0", // Remove any default padding
                    height: "100%", // Ensure the card takes full height
                  }}
                >
                  <CardMedia
                    component="img"
                    height="110"
                    image={giftImg}
                    alt="Image 1"
                    sx={{
                      display: "block", // Ensure the image is displayed as a block
                    }}
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#323738",
                      textAlign: "left",
                      height: "70px",
                      "&.MuiCardContent-root:last-child": {
                        paddingBottom: "14px",
                      },
                      "&.MuiCardContent-root": {
                        padding: 0,
                      },
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "13px",
                        padding: "5px 10px",
                      }}
                    >
                      Gifts
                    </Typography>
                    <Typography
                      variant="h1"
                      color="text.secondary"
                      sx={{
                        color: "#B3BEC1",
                        fontSize: "12px",
                        padding: "0px 10px",
                      }}
                    >
                      Enter the redemption code to receive gift rewards
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card
                  onClick={navigateToPage3}
                  sx={{
                    borderRadius: "10px",
                    border: "none", // Ensure no border is shown
                    boxShadow: "none", // Ensure no shadow is causing the issue
                    overflow: "hidden", // Ensure no overflow causes visual artifacts
                    backgroundColor: "#323738", // Match the background color
                    margin: "0", // Remove any default margin
                    padding: "0", // Remove any default padding
                    height: "100%", // Ensure the card takes full height
                  }}
                >
                  <CardMedia
                    component="img"
                    height="110"
                    image={attendanceBonusImg}
                    alt="Image 2"
                    sx={{
                      display: "block", // Ensure the image is displayed as a block
                    }}
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#323738",
                      textAlign: "left",
                      height: "70px",
                      "&.MuiCardContent-root:last-child": {
                        paddingBottom: "14px",
                      },
                      "&.MuiCardContent-root": {
                        padding: 0,
                      },
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "13px",
                        padding: "5px 10px",
                      }}
                    >
                      Attendance bonus
                    </Typography>
                    <Typography
                      variant="h1"
                      color="text.secondary"
                      sx={{
                        color: "#B3BEC1;",
                        fontSize: "12px",
                        padding: "0px 10px",
                      }}
                    >
                      The more consecutive days you sign in, the higher the reward will
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Banner */}
            {/* <Grid sx={{ mx: "10px" }}> <Champion /></Grid> */}

            <BannerCard />
          </Box>
        </Box>
        <BottomNavigationArea />
      </Mobile>
    </>
  );
};

export default Activity;
