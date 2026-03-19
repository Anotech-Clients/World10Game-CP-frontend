import { useNavigate } from "react-router-dom";
import { useContext } from "react"
// import activities from "../../data/activities.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Mobile from "../layout/Mobile"
import BannerPosterContext from "../../context/BannerPosterContext"
const WinningStreakRule = () => {
  const navigate = useNavigate(); // Initialize navigate for handling navigation
const bannerPosterContext = useContext(BannerPosterContext)
  const winstreakBannerUrl = bannerPosterContext?.winstreakUrl;
  const winstreakPoster = bannerPosterContext?.winstreakPosterUrl;

  return (
    <Mobile>
    <Box
      display="flex"
      flexDirection="column"
      height="calc(var(--vh, 1vh) * 100)"
      position="relative"
    >
      {/* Top Bar */}
      <Grid
          container
          alignItems="center"
          justifyContent="center"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#232626",
            padding: "7px 12px",
          }}
        >
          <Grid
            item
            xs={12}
            container
            alignItems="center"
            justifyContent="center"
          >
            <IconButton
              sx={{
                color: "#ffffff",
                position: "absolute",
                left: 0,
                p: "12px",
              }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ color: "#ffffff", textAlign: "center", fontSize: "19px" }}
            >
              Rules
            </Typography>
          </Grid>
        </Grid>

      {/* Content Area */}
      <Box sx={{ padding: 2, flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <img
            src={
                winstreakBannerUrl
                  ? winstreakBannerUrl
                  : "/assets/winningStreak/winningStreakBanner.webp"
              }
            alt="Top Banner"
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 5,
              marginTop: -15,
            }}
          />
        </Box>
        <Typography
          sx={{ color: "#ffffff", fontWeight: "bold", marginBottom: 1 }}
        >
         World 10 Game Winning Streak 
        </Typography>
        {/* <Typography sx={{ marginBottom: 2 }}>
          {activity.description}
        </Typography> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <img
            src={
                winstreakPoster
                  ? winstreakPoster
                  : "/assets/winningStreak/rules.webp"
              }
            alt="Bottom Banner"
            style={{ width: 370, height: "auto" }}
          />
        </Box>
      </Box>
    </Box>
    </Mobile>
  );
};

export default WinningStreakRule;
