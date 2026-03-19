import { useContext, useEffect, useRef, useState } from "react"
import {
    Box,
    Grid,
    Typography,
    Card,
    Button,
    //   CardContent,
    CardMedia,
    Container,
    styled,
    LinearProgress,
} from "@mui/material"
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import Mobile from "../../components/layout/Mobile"
import { CQ9, EVO_Electronic, FISH, IDEAL, JDB, JILI, MG, PG, PVC, SPORT, SPRIBE } from "../../data/GameImg"
import { GameContext } from "../../context/GameContext"
import Pvc from "../../components/home/Pvc"
import NeedToDepositModal from "../../components/common/NeedToDepositModal"

// Styled components
const ScrollableBox = styled(Box)({
    display: "flex",
    overflowX: "auto",
    "&::-webkit-scrollbar": {
        display: "none",
    },
    scrollbarWidth: "none",
})

const LotteryButton = styled(Box)(({ theme, active }) => ({
    background: active ? "linear-gradient(90deg,#24ee89,#9fe871)" : "#323738",
    color: active ? "#000" : "#a8a5a1",
    cursor: "pointer",
    padding: "4px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    minWidth: "80px",
    margin: "5px 3px",
    borderRadius: "5px",
}))

const gamesData = [
    // Original category using images from the 'original' array
    {
        id: 7,
        name: "Treasure Hunt",
        image: "/assets/800_20240601192244182.jpg",
        category: "Mini games",
        odds: "90.00%",
    },
    {
        id: 8,
        name: "Plinko Fun",
        image: "/assets/plinko.png",
        category: "Mini games",
        odds: "85.00%",
    },
    {
        id: 9,
        name: "Epic Quest",
        image: "/assets/110_20240330120322752.png",
        category: "Mini games",
        odds: "88.50%",
    },
    {
        id: 10,
        name: "Mega Jackpot",
        image: "/assets/22001.png",
        category: "Mini games",
        odds: "82.75%",
    },
    {
        id: 11,
        name: "K3 Surprise",
        image: "/assets/22004.png",
        category: "Mini games",
        odds: "81.00%",
    },
    {
        id: 12,
        name: "K3 Adventure",
        image: "/assets/22005.png",
        category: "Mini games",
        odds: "86.00%",
    },

    // Slots category using images from the 'Slots' array
    {
        id: 13,
        name: "Jackpot Mania",
        image: "/assets/Jili Game.png",
        category: "Slots",
        odds: "84.00%",
    },
    {
        id: 14,
        name: "Lucky Spin",
        image: "/assets/Pg game.png",
        category: "Slots",
        odds: "77.50%",
    },
    {
        id: 15,
        name: "Mega Win",
        image: "/assets/Ag game.png",
        category: "Slots",
        odds: "85.25%",
    },
    {
        id: 16,
        name: "Gold Rush",
        image: "/assets/U game.png",
        category: "Slots",
        odds: "80.30%",
    },
    {
        id: 17,
        name: "Coq Game",
        image: "/assets/Coq game.png",
        category: "Slots",
        odds: "89.10%",
    },
    {
        id: 18,
        name: "Evolution Game",
        image: "/assets/Evolution.png",
        category: "Slots",
        odds: "90.40%",
    },

    // Sports category using images from the 'Sports' array
    {
        id: 19,
        name: "Champion's League",
        image: "/assets/gsports.png",
        category: "Sports",
        odds: "88.77%",
    },
    {
        id: 20,
        name: "World Cup",
        image: "/assets/cmd.png",
        category: "Sports",
        odds: "84.17%",
    },
    {
        id: 21,
        name: "Olympic Games",
        image: "/assets/saba.png",
        category: "Sports",
        odds: "82.50%",
    },

    // {
    //   id: 24,
    //   name: "Basketball Blitz",
    //   image: "/assets/rabbit.png",
    //   category: "Sports",
    //   odds: "79.80%",
    // },

    // Fishing category using images from the 'Fishing' array
    {
        id: 26,
        name: "Ocean Catch",
        image: "/assets/119.png",
        category: "Fishing",
        odds: "82.50%",
    },
    {
        id: 27,
        name: "Tropical Fish",
        image: "/assets/20.png",
        category: "Fishing",
        odds: "84.75%",
    },
    {
        id: 28,
        name: "Catch of the Day",
        image: "/assets/212.png",
        category: "Fishing",
        odds: "90.00%",
    },
    {
        id: 29,
        name: "Sea Adventure",
        image: "/assets/32.png",
        category: "Fishing",
        odds: "87.60%",
    },
    {
        id: 30,
        name: "Fishing Frenzy",
        image: "/assets/42.png",
        category: "Fishing",
        odds: "85.00%",
    },

    // Adding more data to the Fishing category
    {
        id: 31,
        name: "Aqua Blast",
        image: "/assets/AB3 (1).png",
        category: "Fishing",
        odds: "83.20%",
    },
    {
        id: 32,
        name: "Tidal Spin",
        image: "/assets/AT01.png",
        category: "Fishing",
        odds: "86.70%",
    },
    {
        id: 33,
        name: "Marine Mayhem",
        image: "/assets/AT05.png",
        category: "Fishing",
        odds: "89.90%",
    },
    {
        id: 34,
        name: "Golden Ocean",
        image: "/assets/GO02.png",
        category: "Fishing",
        odds: "84.00%",
    },
    {
        id: 35,
        name: "Deep Sea Treasure",
        image: "/assets/67001.png",
        category: "Fishing",
        odds: "88.00%",
    },
    {
        id: 36,
        name: "Coral Rush",
        image: "/assets/7001.png",
        category: "Fishing",
        odds: "87.50%",
    },
    {
        id: 37,
        name: "Whale Hunter",
        image: "/assets/7002.png",
        category: "Fishing",
        odds: "89.00%",
    },
    {
        id: 38,
        name: "Shark Frenzy",
        image: "/assets/7003.png",
        category: "Fishing",
        odds: "85.50%",
    },
    {
        id: 39,
        name: "Deep Dive",
        image: "/assets/7004.png",
        category: "Fishing",
        odds: "84.20%",
    },
    {
        id: 40,
        name: "Sea Dragon",
        image: "/assets/7005.png",
        category: "Fishing",
        odds: "90.10%",
    },
    {
        id: 41,
        name: "Reef Hunter",
        image: "/assets/7006.png",
        category: "Fishing",
        odds: "83.75%",
    },
    {
        id: 42,
        name: "Underwater Riches",
        image: "/assets/7007.png",
        category: "Fishing",
        odds: "88.50%",
    },
    {
        id: 43,
        name: "Splash Jackpot",
        image: "/assets/1.png",
        category: "Fishing",
        odds: "86.00%",
    },
    {
        id: 44,
        name: "Sunken Treasures",
        image: "/assets/60.png",
        category: "Fishing",
        odds: "87.30%",
    },
    {
        id: 45,
        name: "Mermaid's Cove",
        image: "/assets/71.png",
        category: "Fishing",
        odds: "85.70%",
    },
    {
        id: 46,
        name: "Tropical Waves",
        image: "/assets/74.png",
        category: "Fishing",
        odds: "89.50%",
    },
    {
        id: 47,
        name: "Stormy Seas",
        image: "/assets/82.png",
        category: "Fishing",
        odds: "83.25%",
    },
    {
        id: 48,
        name: "Reel King",
        image: "/assets/510.png",
        category: "Fishing",
        odds: "86.40%",
    },
    {
        id: 49,
        name: "Fu Wa Fishing",
        image: "/assets/SFG_WDFuWaFishing.png",
        category: "Fishing",
        odds: "84.50%",
    },
    {
        id: 50,
        name: "Golden Blast Fishing",
        image: "/assets/SFG_WDGoldBlastFishing.png",
        category: "Fishing",
        odds: "87.10%",
    },
    {
        id: 51,
        name: "Golden Fortune Fishing",
        image: "/assets/SFG_WDGoldenFortuneFishing.png",
        category: "Fishing",
        odds: "89.30%",
    },
    {
        id: 52,
        name: "Golden Tyrant Fishing",
        image: "/assets/SFG_WDGoldenTyrantFishing.png",
        category: "Fishing",
        odds: "88.00%",
    },
    {
        id: 53,
        name: "Merry Island Fishing",
        image: "/assets/SFG_WDMerryIslandFishing.png",
        category: "Fishing",
        odds: "90.25%",
    },

    // Rummy category using images from the 'Rummy' array
    { id: 54, name: "Rummy Showdown", image: "/assets/365games.png", category: "Rummy", },
    { id: 55, name: "Rummy Showdown", image: "/assets/v8poker.png", category: "Rummy", },

]

const lotteryItems = [
    {
        id: 1,
        name: "Win Go",
        image: "/assets/lottery/wingo.webp",
        description: "Guess Number",
        description1: "Green/Red/Violet to win",
        path: "/timer",
    },
    {
        id: 2,
        name: "K3",
        image: "/assets/lottery/K3Lottery.webp",
        description: "Guess Number",
        description1: "Big/Small/Odd/Even",
        path: "/k3",
    },
    {
        id: 3,
        name: "5D",
        image: "/assets/lottery/5dLottery.webp",
        description: "Guess Number",
        description1: "Big/Small/Odd/Even",
        path: "/5d",
    },
    // {
    //     id: 4,
    //     name: "Car Race",
    //     image: "/assets/lottery/car.webp",
    //     description: "Guess Number",
    //     description1: "Green/Red/Violet to win",
    //     path: "/car-race",
    // },
]

const categories = [
    { name: "Lottery", imageSelected: "/assets/icons/lottery-selected.webp", imageUnselected: "/assets/icons/lottery-selected.webp" },
    { name: "Slots", imageSelected: "/assets/icons/slots-selected.webp", imageUnselected: "/assets/icons/slots-selected.webp" },
    { name: "Mini games", imageSelected: "/assets/icons/original-selected.webp", imageUnselected: "/assets/icons/original-selected.webp" },
    { name: "Fishing", imageSelected: "/assets/icons/fishing-selected.webp", imageUnselected: "/assets/icons/fishing-selected.webp" },
    { name: "Casino", imageSelected: "/assets/icons/casino-selected.webp", imageUnselected: "/assets/icons/casino-selected.webp" },
    { name: "PVC", imageSelected: "/assets/icons/pvc-selected.webp", imageUnselected: "/assets/icons/pvc-selected.webp" },
    { name: "Sports", imageSelected: "/assets/icons/sports-selected.webp", imageUnselected: "/assets/icons/sports-selected.webp" },

    // { name: "Popular", imageSelected: "/assets/icons/original-selected.webp", imageUnselected: "/assets/icons/original-unselected.webp" },
]

const LotteryItem = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    // border: "1px solid #24ee89",
    borderRadius: "20px",
    // width: "100%",
    background: "linear-gradient(90deg,#24ee89,#9fe871)",
    textAlign: "left",
    margin: "5px",
    paddingBottom: "0px",
    paddingRight: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
})

const LotteryDescription = styled(Box)({
    marginTop: "8px",
    marginBottom: "6px",
})

const LotteryImage = styled("img")({
    borderRadius: "8px",
    objectFit: "cover",
})

const AllGamesPage = () => {
    const { id } = useParams()
    const { axiosInstance } = useAuth();
    //   const activeCategoryId = id
    const [activeCategory, setActiveCategory] = useState(id ? id : "Lottery")
    const categoryBarRef = useRef(null)
    const activeCategoryRef = useRef(null)
    const [currentCategory, setCurrentCategory] = useState(null)
    const { handleApiClick } = useContext(GameContext)
    const navigate = useNavigate()
    const [firstDepositMade, setFirstDepositMade] = useState(false);
    const [needToDepositMode, setNeedToDepositMode] = useState(false);
    const [openDepositModal, setOpenDepositModal] = useState(false);

    useEffect(() => {
        setActiveCategory(id)
        //console.log(id, "activeCategoryId")
        if (id === "Slots") {
            setCurrentCategory("JILI")
        }
        else if (id === "Mini games") {
            setCurrentCategory("SPRIBE")
        }
        else if (id === "Casino") {
            setCurrentCategory("IDEAL")
        }
        else if (id === "Fishing") {
            setCurrentCategory("FISH")
        }
        else if (id === "PVC") {
            setCurrentCategory("PVC")
        }
        else if (id === "Sports") {
            setCurrentCategory("Sports")
        }
        else {
            setCurrentCategory(null)
        }
    }, [id])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axiosInstance.get("/api/user/me")

                if (userResponse.data.success && userResponse.data.body.user) {
                    const userData = userResponse.data.body.user
                    setFirstDepositMade(userData.isFirstDepositMode === true)
                }

                const depositModeResponse = await axiosInstance.get("/api/additional/need-to-deposit/mode")
                const { needToDepositMode } = depositModeResponse.data
                setNeedToDepositMode(needToDepositMode)
            } catch (error) {
                console.error("Error fetching user data or deposit mode:", error)
            }
        }

        fetchUserData()
    }, [axiosInstance])

    const handleLotteryClick = (path) => {
        if (needToDepositMode && !firstDepositMade) {
            setOpenDepositModal(true);
        } else {
            console.log("path--------->", path)
            navigate(path);
        }
    }
    const handleCloseDepositModal = () => {
        setOpenDepositModal(false);
    };

    const handleConfirmDeposit = () => {
        navigate("/wallet/deposit");
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category)
        //console.log(activeCategory, "activeCategory")
        //console.log(id, "activeCategoryId")
        //console.log(category, "category")
        //console.log(currentCategory, "currentCategory")
        if (category === "Slots") {
            setCurrentCategory("JILI")
        }
        else if (category === "Mini games") {
            setCurrentCategory("SPRIBE")
        }
        else if (category === "Casino") {
            setCurrentCategory("IDEAL")
        }
        else if (category === "Fishing") {
            setCurrentCategory("FISH")
        }
        else if (category === "PVC") {
            setCurrentCategory("PVC")
        }
        else if (category === "Sports") {
            setCurrentCategory("SPORT")
        }
        else {
            setCurrentCategory(category)
        }
    }

    useEffect(() => {
        if (activeCategoryRef.current && categoryBarRef.current) {
            const container = categoryBarRef.current
            const activeElement = activeCategoryRef.current

            // Calculate the exact center position
            const containerWidth = container.clientWidth
            const elementWidth = activeElement.clientWidth

            // This centers the element precisely
            const scrollPosition = activeElement.offsetLeft - (containerWidth / 2) + (elementWidth / 2)

            // Apply the scroll with smooth behavior
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            })
        }
    }, [activeCategory])

    const filteredGames =
        activeCategory === "All"
            ? gamesData
            : gamesData.filter((game) => game.category === activeCategory)

    const filteredLotteryItems = activeCategory === "Lottery" ? lotteryItems : []

    const filteredCasinoItems = activeCategory === "Casino" ? IDEAL : []

    const filteredMiniGamesItems = activeCategory === "Mini games" ? SPRIBE : []

    const filteredFishGamesItems = activeCategory === "Fishing" ? FISH : []

    const filteredSlotsItems = activeCategory === "Slots" ? JILI.slice(0, 6) : []

    const filteredPVCItems = activeCategory === "PVC" ? PVC : []

    const filteredSportsItems = activeCategory === "Sports" ? SPORT : []

    const filterCQ9 = CQ9.slice(0, 6)
    const filterMG = MG.slice(0, 6)
    const filterPG = PG.slice(0, 6)
    const filterJDB = JDB.slice(0, 6)
    const filterEVO = EVO_Electronic.slice(0, 6)

    return (
        <Mobile>
            <Box
                sx={{
                    background: "#323738",
                    padding: "8px 10px",
                    display: "flex",
                    alignItems: "center",
                    color: "#f5f3f0",
                }}
            >
                <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                    <ChevronLeftIcon sx={{ fontSize: 30 }} />
                </Link>
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#f5f3f0",
                    }}
                >
                    {activeCategory}
                </Typography>
            </Box>

            <ScrollableBox
                my={1}
                px={1}
                sx={{ flexShrink: 0 }}
                ref={categoryBarRef}
            >
                {categories.map((category) => (
                    <LotteryButton
                        key={category.name}
                        active={activeCategory === category.name}
                        onClick={() => handleCategoryChange(category.name)}
                        ref={activeCategory === category.name ? activeCategoryRef : null}
                    >
                        <img
                            src={activeCategory === category.name ? category.imageSelected : category.imageUnselected}
                            alt={category.name}
                            style={{ width: "25px", height: "25px", marginBottom: "1px" }}
                        />
                        <Typography variant="caption">{category.name}</Typography>
                    </LotteryButton>
                ))}
            </ScrollableBox>

            <Grid container spacing={1} sx={{ overflowY: "auto", overflowX: "hidden", width: "100%", ml: 0 }}>
                <>
                    {activeCategory === "Lottery" &&
                        filteredLotteryItems.length > 0 && (
                            <>
                                <Typography
                                    align="left"
                                    sx={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        ml: 1.5,
                                        color: "#F5F3F0",
                                        mb: 2,
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "#24ee89",
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        |
                                    </span>{" "}
                                    Lottery
                                </Typography>
                                <Grid container spacing={2} marginLeft="0px">
                                    {filteredLotteryItems.map((item) => (
                                        <Container
                                            sx={{
                                                paddingLeft: { xs: 1, sm: 1 },
                                                paddingRight: { xs: 1, sm: 1 },
                                            }}
                                            key={item.id}
                                        >
                                            <Grid item xs={12} sm={12} md={12}>
                                                 <div onClick={() => handleLotteryClick(item.path)} style={{ textDecoration: "none" }}>
                                                    <LotteryItem
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            padding: 0,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                flex: 1,
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                ml: 2,
                                                            }}
                                                        >
                                                            <Typography variant="h6" sx={{ color: "white", mt: 1 }}>
                                                                {item.name}
                                                            </Typography>
                                                            <LotteryDescription>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{ color: "white", fontSize: "12px" }}
                                                                >
                                                                    {item.description}
                                                                    <br />
                                                                    {item.description1}
                                                                </Typography>
                                                            </LotteryDescription>
                                                        </Box>
                                                        <LotteryImage
                                                            src={item.image}
                                                            alt={item.name}
                                                            sx={{
                                                                // width: "60px",
                                                                height: "90px",
                                                                marginLeft: 2,
                                                            }} // Adjusted to use `sx`
                                                        />
                                                    </LotteryItem>
                                                </div>
                                            </Grid>
                                        </Container>
                                    ))}
                                </Grid>
                            </>
                        )}
                </>
                <>
                    {activeCategory === "Slots" && filteredSlotsItems.length > 0 && (
                        <>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    ml: 2,
                                    color: "white",
                                    // mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                JILI Slots
                            </Typography>
                            <Grid container spacing={2} sx={{ padding: 2 }}>
                                {filteredSlotsItems.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "SLOT")}
                                    >
                                        <Box
                                            component="img"
                                            src={item.imgSrc}
                                            alt={item.game}
                                            sx={{
                                                width: '100%',
                                                maxWidth: '120px',
                                                aspectRatio: '1 / 1',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            <Grid container spacing={1} onClick={() => navigate("/all-slots/JILI")} sx={{ justifyContent: "center", mt: 0,mb:1 }}>
                                <Button
                                    sx={{
                                        background: " linear-gradient(90deg,#24ee89,#9fe871)",
                                        color: "white",
                                        textTransform: "none",
                                        borderRadius: "40px",
                                        px: 4,
                                        boxShadow: "0px 1.6px 3.2px rgba(0,0,0,0.2)",
                                    }}
                                >All Games</Button>
                            </Grid>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    ml: 2,
                                    color: "white",
                                    // mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                PG Slots
                            </Typography>
                            <Grid container spacing={2} sx={{ padding: 2 }}>
                                {filterPG.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "SLOT")}
                                    >
                                        <Box
                                            component="img"
                                            src={item.imgSrc}
                                            alt={item.game}
                                            sx={{
                                                width: '100%',
                                                maxWidth: '120px',
                                                aspectRatio: '1 / 1',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid container spacing={1} onClick={() => navigate("/all-slots/PG")} sx={{ justifyContent: "center",  mt: 0,mb:1 }}>
                                <Button
                                    sx={{
                                        background: " linear-gradient(90deg,#24ee89,#9fe871)",
                                        color: "white",
                                        textTransform: "none",
                                        borderRadius: "40px",
                                        px: 4,
                                        boxShadow: "0px 1.6px 3.2px rgba(0,0,0,0.2)",
                                    }}
                                >All Games</Button>
                            </Grid>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    ml: 2,
                                    color: "white",
                                    // mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                CQ9 Slots
                            </Typography>
                            <Grid container spacing={2} sx={{ padding: 2 }}>
                                {filterCQ9.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "SLOT")}
                                    >
                                        <Box
                                            component="img"
                                            src={item.imgSrc}
                                            alt={item.game}
                                            sx={{
                                                width: '100%',
                                                maxWidth: '120px',
                                                aspectRatio: '1 / 1',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid container spacing={1} onClick={() => navigate("/all-slots/CQ9")}  sx={{ justifyContent: "center", mt: 0,mb:1 }}>
                                <Button
                                    sx={{
                                        background: " linear-gradient(90deg,#24ee89,#9fe871)",
                                        color: "white",
                                        textTransform: "none",
                                        borderRadius: "40px",
                                        px: 4,
                                        boxShadow: "0px 1.6px 3.2px rgba(0,0,0,0.2)",
                                    }}
                                >All Games</Button>
                            </Grid>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    ml: 2,
                                    color: "white",
                                    // mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                JDB Slots
                            </Typography>
                            <Grid container spacing={2} sx={{ padding: 2 }}>
                                {filterJDB.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "SLOT")}
                                    >
                                         <Box
                                            component="img"
                                            src={item.imgSrc}
                                            alt={item.game}
                                            sx={{
                                                width: '100%',
                                                maxWidth: '120px',
                                                aspectRatio: '1 / 1',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid container spacing={1} onClick={() => navigate("/all-slots/JDB")} sx={{ justifyContent: "center",  mt: 0,mb:1}}>
                                <Button
                                    sx={{
                                        background: " linear-gradient(90deg,#24ee89,#9fe871)",
                                        color: "white",
                                        textTransform: "none",
                                        borderRadius: "40px",
                                        px: 4,
                                        boxShadow: "0px 1.6px 3.2px rgba(0,0,0,0.2)",
                                    }}
                                >All Games</Button>
                            </Grid>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    ml: 2,
                                    color: "white",
                                    // mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                MG Slots
                            </Typography>
                            <Grid container spacing={2} sx={{ padding: 2 }}>
                                {filterMG.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "SLOT")}
                                    >
                                        <Box
                                            component="img"
                                            src={item.imgSrc}
                                            alt={item.game}
                                            sx={{
                                                width: '100%',
                                                maxWidth: '120px',
                                                aspectRatio: '1 / 1',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid container spacing={1} onClick={() => navigate("/all-slots/MG")} sx={{ justifyContent: "center",  mt: 0,mb:1}}>
                                <Button
                                    sx={{
                                        background: " linear-gradient(90deg,#24ee89,#9fe871)",
                                        color: "white",
                                        textTransform: "none",
                                        borderRadius: "40px",
                                        px: 4,
                                        boxShadow: "0px 1.6px 3.2px rgba(0,0,0,0.2)",
                                    }}
                                >All Games</Button>
                            </Grid>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    ml: 2,
                                    color: "white",
                                    // mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                EVO Slots
                            </Typography>
                            <Grid container spacing={2} sx={{ padding: 2 }}>
                                {filterEVO.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "SLOT")}
                                    >
                                         <Box
                                            component="img"
                                            src={item.imgSrc}
                                            alt={item.game}
                                            sx={{
                                                width: '100%',
                                                maxWidth: '120px',
                                                aspectRatio: '1 / 1',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid container spacing={1} onClick={() => navigate("/all-slots/EVO")} sx={{ justifyContent: "center",  mt: 0,mb:5 }}>
                                <Button
                                    sx={{
                                        background: " linear-gradient(90deg,#24ee89,#9fe871)",
                                        color: "white",
                                        textTransform: "none",
                                        borderRadius: "40px",
                                        px: 4,
                                        boxShadow: "0px 1.6px 3.2px rgba(0,0,0,0.2)",
                                    }}
                                >All Games</Button>
                            </Grid>
                        </>
                    )}
                </>

                <>
                    {activeCategory === "Mini games" && filteredMiniGamesItems.length > 0 && (
                        <>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    ml: 2,
                                    color: "#F5F3F0",
                                    mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                Mini games
                            </Typography>
                            <Grid container spacing={0.5} sx={{ px: "10px" }}>
                                {filteredMiniGamesItems.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            border: "none",
                                            position: "relative",
                                            background: "transparent",
                                            p: 0.5,
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "SPRIBE")}
                                    >
                                        <img
                                            src={item.imgSrc}
                                            alt={item.game}
                                            style={{
                                                width: "100%",
                                                aspectRatio: "3/4",
                                                borderRadius: "5px"
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </>

                <>
                    {activeCategory === "Fishing" && filteredFishGamesItems.length > 0 && (
                        <>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    ml: 2,
                                    color: "#F5F3F0",
                                    mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                Fishing
                            </Typography>
                            <Grid container spacing={0.5} sx={{ px: "10px" }}>
                                {filteredFishGamesItems.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            border: "none",
                                            position: "relative",
                                            background: "transparent",
                                            p: 0.5,
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "FISH")}
                                    >
                                        <img
                                            src={item.imgSrc}
                                            alt={item.game}
                                            style={{
                                                width: "100%",
                                                aspectRatio: "1/1",
                                                borderRadius: "5px"
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </>

                <>
                    {activeCategory === "Casino" && filteredCasinoItems.length > 0 && (
                        <>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    ml: 2,
                                    color: "#F5F3F0",
                                    mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                Casino
                            </Typography>
                            <Grid container spacing={0.5} sx={{ px: "10px" }}>
                                {filteredCasinoItems.map((item, index) => (
                                    <Grid
                                        item
                                        xs={4}
                                        key={item.id || index}
                                        sx={{
                                            border: "none",
                                            position: "relative",
                                            background: "transparent",
                                            p: 0.5,
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "CASINO")}
                                    >
                                        <img
                                            src={item.imgSrc}
                                            alt={item.game}
                                            style={{
                                                width: "100%",
                                                aspectRatio: "3/4",
                                                borderRadius: "5px"
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </>

                <>
                    {activeCategory === "PVC" && filteredPVCItems.length > 0 && (
                        <>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    ml: 2,
                                    color: "white",
                                    mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                PVC
                            </Typography>
                            <Grid container spacing={1} sx={{ px: "10px" }}>
                                {filteredPVCItems.map((item, index) => (
                                    <Grid
                                        item
                                        xs={6}
                                        key={item.id || index}
                                        sx={{
                                            border: "none",
                                            position: "relative",
                                            bgcolor: "transparent",
                                            p: 0.5,
                                        }}
                                        // onClick={() => handleApiClick(item.id, currentCategory, "PVC")}
                                        onClick={() => navigate(`/pvc/allgames?index=${index}`)}
                                    >
                                        <img
                                            src={item.imgSrc}
                                            alt={item.game}
                                            style={{
                                                width: "100%",
                                                aspectRatio: "3/4",
                                                borderRadius: "8px"
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </>
                <>
                    {activeCategory === "Sports" && filteredSportsItems.length > 0 && (
                        <>
                            <Typography
                                align="left"
                                sx={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    ml: 2,
                                    color: "white",
                                    mb: 1,
                                }}
                            >
                                <span
                                    style={{
                                        color: "#24ee89",
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    |
                                </span>{" "}
                                Sport
                            </Typography>
                            <Grid container spacing={1} sx={{ px: "10px" }}>
                                {filteredSportsItems.map((item, index) => (
                                    <Grid
                                        item
                                        xs={6}
                                        key={item.id || index}
                                        sx={{
                                            border: "none",
                                            position: "relative",
                                            bgcolor: "transparent",
                                            p: 0.5,
                                        }}
                                        onClick={() => handleApiClick(item.id, currentCategory, "SPORT")}
                                    >
                                        <img
                                            src={item.imgSrc}
                                            alt={item.game}
                                            style={{
                                                width: "100%",
                                                aspectRatio: "3/4",
                                                borderRadius: "8px"
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </>
            </Grid>
            <NeedToDepositModal
                open={openDepositModal}
                onClose={handleCloseDepositModal}
                onConfirm={handleConfirmDeposit}
            />
        </Mobile>
    )
}

export default AllGamesPage