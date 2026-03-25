import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  ThemeProvider,
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { domain } from "../../../utils/Secret";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    allVariants: {
      fontFeatureSettings: '"cv11", "cv01", "ss01"',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: "Inter, sans-serif",
          backgroundColor: "rgba(99, 102, 241, 0.05)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(148, 163, 184, 0.12)",
            transition: "border-color 0.2s ease-in-out",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(148, 163, 184, 0.3)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6366f1",
          },
          height: "42px",
          fontSize: "14px",
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: "Inter, sans-serif",
          "& .MuiOutlinedInput-root": {
            height: "42px",
            fontSize: "14px",
            backgroundColor: "rgba(99, 102, 241, 0.05)",
            transition: "all 0.2s ease-in-out",
            "& fieldset": {
              borderColor: "rgba(148, 163, 184, 0.12)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(148, 163, 184, 0.3)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6366f1",
            },
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
          // borderRadius: "16px",
          backgroundColor: "#1e293b",
          border: "1px solid rgba(148, 163, 184, 0.12)",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(99, 102, 241, 0.05)",
          "& .MuiTableCell-head": {
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#f8fafc",
            height: "48px",
            padding: "0 16px",
            borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableRow-root": {
            height: "56px",
            "&:nth-of-type(even)": {
              backgroundColor: "rgba(99, 102, 241, 0.03)",
            },
            "&:hover": {
              backgroundColor: "rgba(99, 102, 241, 0.08)",
            },
            transition: "background-color 0.2s ease-in-out",
          },
          "& .MuiTableCell-body": {
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            padding: "0 16px",
            color: "#f8fafc",
            borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontFamily: "Inter, sans-serif",
          borderTop: "1px solid rgba(148, 163, 184, 0.12)",
          color: "#f8fafc",
        },
        selectIcon: {
          color: "#94a3b8",
        },
      },
    },
  },
});

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("mobile");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { axiosInstance } = useAuth();

  // Fetch users whenever page, rowsPerPage, or searchTerm changes
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async (searchNow = false) => {
    setIsLoading(true);
    try {
      // Calculate the actual API page number (API uses 1-based indexing)
      const apiPage = page + 1;

      // Build the API URL with pagination parameters
      let url = `${domain}/api/admin/members/users?page=${apiPage}&limit=${rowsPerPage}`;

      // Add search parameters if there's a search term
      if ((searchNow || searchTerm) && searchTerm.trim()) {
        // Use the proper parameter name based on searchType
        const paramName = searchType; // 'mobile' or 'uid'
        url += `&${paramName}=${encodeURIComponent(searchTerm.trim())}`;
      }

      //console.log("Fetching URL:", url);

      const response = await axiosInstance.get(url, {
        withCredentials: true,
      });

      const { users, total } = response.data.data;
      //console.log("Fetched users:", users);
      //console.log("Total users:", total);

      setUsers(users || []);
      setTotalUsers(total || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    // Reset to first page when searching
    setPage(0);
    fetchUsers(true);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setPage(0);

    // Delay fetch to ensure state updates
    setTimeout(() => {
      fetchUsers();
    }, 10);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        p: 3, bgcolor: "background.default", minHeight: "100vh",
        borderRadius: '16px'
      }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 4,
            pl: 1,
          }}
        >
          <GroupOutlinedIcon sx={{ fontSize: 28, color: "#f8fafc" }} />
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              lineHeight: 1.5,
              color: "#f8fafc",
            }}
          >
            Active Users
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            px: 1
          }}
        >
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            sx={{ width: 130 }}
          >
            <MenuItem value="mobile">Mobile</MenuItem>
            <MenuItem value="uid">UID</MenuItem>
          </Select>

          <Box sx={{ position: "relative", flex: 1 }}>
            <TextField
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search by ${searchType}`}
              sx={{ backgroundColor: "rgba(99, 102, 241, 0.05)" }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                onClick={handleSearch}
                size="small"
                sx={{
                  color: "#6366f1",
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(99, 102, 241, 0.2)"
                  }
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={handleRefresh}
                size="small"
                sx={{
                  color: "#6366f1",
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(99, 102, 241, 0.2)"
                  }
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: "100%", px: 1 }}>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: "calc(100vh - 240px)",
              "&::-webkit-scrollbar": {
                display: "none"
              },
              scrollbarWidth: "none",  // For Firefox
              msOverflowStyle: "none"  // For IE and Edge
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" width="70px">#</TableCell>
                  <TableCell align="left">User</TableCell>
                  <TableCell align="center">Mobile</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="center">Password</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center" width="100px">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography sx={{ color: "#94a3b8" }}>
                        Loading...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={user.uid}>
                      <TableCell align="center">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "#6366f1",
                            fontWeight: 500,
                            maxWidth: "180px",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {user.userName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: "#94a3b8",
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "0.5px"
                          }}
                        >
                          {user.mobile}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: "14px", color: "#f8fafc", fontWeight: 500 }}>
                          ₹ {Number(user.walletBalance).toLocaleString("en-IN")}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontFamily: "Inter, sans-serif",
                            color: "#f8fafc",
                            backgroundColor: "rgba(99, 102, 241, 0.1)",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "4px",
                            letterSpacing: "0.5px",
                            display: "inline-block"
                          }}
                        >
                          {user.plainPassword}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 2,
                            py: 0.75,
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: 600,
                            letterSpacing: "0.3px",
                            minWidth: "80px",
                            backgroundColor: user.walletBalance > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            color: user.walletBalance > 0 ? "#10b981" : "#ef4444",
                            border: user.walletBalance > 0 ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                          }}
                        >
                          {user.walletBalance > 0 ? "Active" : "Inactive"}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => navigate(`/admin/user-details/${user.uid}`)}
                          sx={{
                            color: "#6366f1",
                            backgroundColor: "rgba(99, 102, 241, 0.1)",
                            borderRadius: "8px",
                            width: "32px",
                            height: "32px",
                            "&:hover": {
                              backgroundColor: "rgba(99, 102, 241, 0.2)",
                              color: "#818cf8",
                            },
                          }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ActiveUsers;