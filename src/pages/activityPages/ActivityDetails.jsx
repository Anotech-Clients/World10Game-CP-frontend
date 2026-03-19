import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react"
import activities from "../../data/activities.json";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Mobile from "../../components/layout/Mobile"
import BannerPosterContext from "../../context/BannerPosterContext"

const ActivityDetails = () => {
  const { id } = useParams(); // Get the activity ID from the route
  const navigate = useNavigate(); // Initialize navigate for handling navigation
  const activity = activities.find((item) => item.id === id); // Find the activity by ID

  // Get banner and poster URLs from context
  const bannerPosterContext = useContext(BannerPosterContext)

  if (!activity) {
    return <div>Activity not found</div>;
  }


  // Determine which URLs to use for each activity based on its ID
  let bannerImageUrl = activity.bannerImage
  let posterImageUrl = activity.posterImage
  let telegramChannelUrl = "#"

  // Match activity ID with the appropriate URLs from context
  switch (activity.id) {
    case "activity-1": // Benefits of Using ARWALLET
      if (bannerPosterContext.rebateUrl) bannerImageUrl = bannerPosterContext.rebateUrl
      if (bannerPosterContext.rebatePosterUrl) posterImageUrl = bannerPosterContext.rebatePosterUrl
      break
    case "activity-2": // Special Attendance Bonus
      if (bannerPosterContext.attendanceUrl) bannerImageUrl = bannerPosterContext.attendanceUrl
      break
    case "activity-3": // World 10 Game Partner Rewards
      if (bannerPosterContext.realtimerebateUrl) bannerImageUrl = bannerPosterContext.realtimerebateUrl
      if (bannerPosterContext.realtimerebatePosterUrl) posterImageUrl = bannerPosterContext.realtimerebatePosterUrl
      break
    case "activity-4": // World 10 Game Daily Luck Spin
      if (bannerPosterContext.youtubeUrl) bannerImageUrl = bannerPosterContext.youtubeUrl
      if (bannerPosterContext.youtubePosterUrl) posterImageUrl = bannerPosterContext.youtubePosterUrl
      break
    case "activity-6": // World 10 Game Official Channel
      if (bannerPosterContext.avaiatorUrl) bannerImageUrl = bannerPosterContext.avaiatorUrl
      if (bannerPosterContext.superjackpotPosterUrl) posterImageUrl = bannerPosterContext.superjackpotPosterUrl
      break


    case "activity-7": // Betting Rebate
      if (bannerPosterContext.usdtUrl) bannerImageUrl = bannerPosterContext.usdtUrl
      if (bannerPosterContext.usdtPosterUrl) posterImageUrl = bannerPosterContext.usdtPosterUrl
      break


    case "activity-8": // Real-Time Rebate
      if (bannerPosterContext.refralbonusUrl) bannerImageUrl = bannerPosterContext.refralbonusUrl
      if (bannerPosterContext.refrealBonusPosterUrl) posterImageUrl = bannerPosterContext.refrealBonusPosterUrl
      break
    case "activity-9": // Super Jackpot
      if (bannerPosterContext.telegramUrl) {
        bannerImageUrl = bannerPosterContext.telegramUrl
        telegramChannelUrl = bannerPosterContext.telegramUrl // Use as href for the link
      }
      break
    case "activity-10": // Youtube Creative Video
      if (bannerPosterContext.luckyspinUrl) bannerImageUrl = bannerPosterContext.luckyspinUrl
      break
    case "activity-11": // UDST Bonus
      if (bannerPosterContext.usdtUrl) bannerImageUrl = bannerPosterContext.usdtUrl
      if (bannerPosterContext.usdtPosterUrl) posterImageUrl = bannerPosterContext.usdtPosterUrl
    default:
      // Use defaults from activities.json
      break
  }
  return (
    <Mobile>
      <Box
        display="flex"
        flexDirection="column"
        height="100dvh"
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
              Acitvity Details
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
              src={bannerImageUrl}
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
            {activity.title}
          </Typography>
          <Typography sx={{ marginBottom: 2 }}>
            {activity.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <img
              src={posterImageUrl}
              alt="Bottom Banner"
              style={{ width: 370, height: "auto" }}
            />
          </Box>
          <br />
        </Box>
        <br />
      </Box>
      <br />
      <br />
      <br />
      <br />
      <br />
    </Mobile>
  );
};

export default ActivityDetails;
