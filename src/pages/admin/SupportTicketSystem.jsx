import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Divider,
    Avatar,
    CircularProgress,
    Tooltip,
    TablePagination,
    Alert,
    Tabs,
    Tab,
    ThemeProvider,
    createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    People as PeopleIcon,
    ErrorOutline as ErrorIcon,
    CheckCircleOutline as CheckIcon,
    MoreVert as MoreVertIcon,
    AccessTime as AccessTimeIcon,
    AttachFile as AttachFileIcon,
    Close as CloseIcon,
    Chat as ChatIcon,
    Visibility as VisibilityIcon,
    Save as SaveIcon,
    ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Dark theme
const darkTheme = createTheme({
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
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid rgba(148, 163, 184, 0.12)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#f8fafc',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
  },
});

// Global styles wrapper
const GlobalStyles = styled('div')({
    '*': {
        fontFamily: 'Inter, sans-serif !important',
        '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'rgba(148, 163, 184, 0.3)',
            borderRadius: '3px',
            '&:hover': {
                background: 'rgba(148, 163, 184, 0.5)'
            }
        }
    }
});

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    borderRadius: '16px',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5)',
    },
}));

const StatusChip = styled(Chip)(({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'OPEN':
                return { bg: '#E3F2FD', color: '#1976D2', border: '#1976D2' };
            case 'IN_PROGRESS':
                return { bg: '#FFF3E0', color: '#F57C00', border: '#F57C00' };
            case 'RESOLVED':
                return { bg: '#E8F5E9', color: '#2E7D32', border: '#2E7D32' };
            case 'CLOSED':
                return { bg: '#EEEEEE', color: '#616161', border: '#616161' };
            case 'REJECTED':
                return { bg: '#FFEBEE', color: '#D32F2F', border: '#D32F2F' };
            default:
                return { bg: '#E0E0E0', color: '#757575', border: '#757575' };
        }
    };

    const colors = getStatusColor();
    return {
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontWeight: 600,
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        height: '24px',
    };
});

const TicketTypeChip = styled(Chip)({
    fontWeight: 500,
    fontSize: '0.75rem',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    color: '#94a3b8',
    height: '24px',
    fontFamily: 'Inter, sans-serif',
});

const StyledTableCell = styled(TableCell)({
    padding: '16px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#f8fafc',
    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
    fontFamily: 'Inter, sans-serif',
});

const StyledTableRow = styled(TableRow)({
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(99, 102, 241, 0.03)',
        fontFamily: 'Inter, sans-serif',
    },
    '&:hover': {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fontFamily: 'Inter, sans-serif',
    },
    transition: 'background-color 0.2s ease',
    fontFamily: 'Inter, sans-serif',
});

const DetailRow = styled(Box)({
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '16px',
    fontFamily: 'Inter, sans-serif',

});

const DetailLabel = styled(Typography)({
    fontWeight: 600,
    minWidth: '120px',
    color: '#94a3b8',
    fontSize: '0.875rem',
    fontFamily: 'Inter, sans-serif',
});

const DetailValue = styled(Typography)({
    color: '#f8fafc',
    fontSize: '0.875rem',
    fontFamily: 'Inter, sans-serif',
    flex: 1,
});

// Image Dialog Component
const ImageDialog = ({ open, onClose, imageUrl }) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        PaperProps={{
            sx: {
                padding: '10px',
                fontFamily: 'Inter, sans-serif',
                background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
                borderRadius: '10px',
                overflow: 'hidden'
            }
        }}
    >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={onClose} size="small">
                <CloseIcon />
            </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
            <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', display: 'block', minWidth: '250px' }} />
        </DialogContent>
    </Dialog>
);

// TabPanel Component
const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} style={{
        padding: '24px',
        fontFamily: 'Inter, sans-serif',

    }}>
        {value === index && children}
    </div>
);

function SupportTicketSystem() {
    const { axiosInstance } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalTickets, setTotalTickets] = useState(0);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [dialogTab, setDialogTab] = useState(0);
    const [ticketFilter, setTicketFilter] = useState({
        status: '',
        type: '',
    });
    const [statusUpdate, setStatusUpdate] = useState({
        status: '',
        priority: '',
    });

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, ticketFilter, activeTab]);


    // Update the fetchData function to properly handle filters
    const fetchData = async () => {
        try {
            setLoading(true);
            const [ticketsResponse, statsResponse] = await Promise.all([
                axiosInstance.get('/api/ticket', {
                    params: {
                        page: page + 1,
                        limit: rowsPerPage,
                        status: ticketFilter.status,
                        type: ticketFilter.type
                    }
                }),
                axiosInstance.get('/api/ticket/stats/overview'),
            ]);

            setTickets(ticketsResponse.data.data.tickets);
            setTotalTickets(ticketsResponse.data.data.pagination.total);
            setStats(statsResponse.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleStatusUpdate = async () => {
        if (!selectedTicket || !statusUpdate.status) return;

        try {
            setStatusUpdateLoading(true);
            setUpdateError('');

            await axiosInstance.put(`/api/ticket/${selectedTicket.id}/status`, {
                status: statusUpdate.status,
                priority: statusUpdate.priority ? parseInt(statusUpdate.priority) : undefined,
            });

            await fetchData();
            setOpenDialog(false);
            setSelectedTicket(null);
            setStatusUpdate({ status: '', priority: '' });
        } catch (error) {
            setUpdateError('Failed to update ticket status. Please try again.');
            console.error('Error updating ticket status:', error);
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage); // This will trigger fetchData via useEffect
    };

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to first page when changing rows per page
    };


    const handleImageClick = (url) => {
        setSelectedImage(url);
        setImageDialogOpen(true);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(0); // Reset to first page when changing tab

        // Update status filter based on tab
        let newStatus = '';
        switch (newValue) {
            case 1:
                newStatus = 'OPEN';
                break;
            case 2:
                newStatus = 'IN_PROGRESS';
                break;
            case 3:
                newStatus = 'RESOLVED';
                break;
            default:
                newStatus = ''; // All tickets
        }
        setTicketFilter(prev => ({ ...prev, status: newStatus }));
    };

    const handleDialogTabChange = (event, newValue) => {
        setDialogTab(newValue);

        const handleStatusFilterChange = (event) => {
            const newStatus = event.target.value;
            setTicketFilter(prev => ({ ...prev, status: newStatus }));

            // Sync tab with status filter
            let newTab = 0;
            switch (newStatus) {
                case 'OPEN':
                    newTab = 1;
                    break;
                case 'IN_PROGRESS':
                    newTab = 2;
                    break;
                case 'RESOLVED':
                    newTab = 3;
                    break;
                default:
                    newTab = 0;
            }
            setActiveTab(newTab);
            setPage(0); // Reset to first page when changing filter
        };
    };

    const StatsCard = ({ title, value, icon: Icon, color }) => (
        <StyledCard>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h4" fontWeight={700} color={color}>
                            {value}
                        </Typography>
                        <Typography
                            color="textSecondary"
                            variant="body2"
                            sx={{ mt: 1, fontSize: '0.875rem', fontWeight: 500 }}
                        >
                            {title}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: `${color}15`,
                            width: 56,
                            height: 56,
                            '& .MuiSvgIcon-root': {
                                color: color,
                                fontSize: 28
                            }
                        }}
                    >
                        <Icon />
                    </Avatar>
                </Box>
            </CardContent>
        </StyledCard>
    );

    return (
        <ThemeProvider theme={darkTheme}>
            <GlobalStyles>
                <Box sx={{ p: 4, maxWidth: '100%', overflow: 'hidden', backgroundColor: '#0f172a', minHeight: '100vh', borderRadius: '16px' }}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        fontWeight={700}
                        sx={{ mb: 4, color: '#f8fafc' }}
                    >
                        Support Ticket Dashboard
                    </Typography>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard
                            title="Total Tickets"
                            value={stats?.totalTickets || 0}
                            icon={AssignmentIcon}
                            color="#1976D2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard
                            title="Open Tickets"
                            value={stats?.byStatus?.open || 0}
                            icon={ErrorIcon}
                            color="#F57C00"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard
                            title="Resolved Tickets"
                            value={stats?.byStatus?.resolved || 0}
                            icon={CheckIcon}
                            color="#2E7D32"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatsCard
                            title="Avg. Resolution Time"
                            value={`${(stats?.avgResolutionTimeHours || 0).toFixed(1)}h`}
                            icon={AccessTimeIcon}
                            color="#7B1FA2"
                        />
                    </Grid>
                </Grid>

                {/* Filters */}
                <Paper sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                            '& .MuiTab-root': {
                                minHeight: '48px',
                                textTransform: 'none',
                                fontWeight: 500
                            }
                        }}
                    >
                        <Tab label="All Tickets" />
                        <Tab label="Open" />
                        <Tab label="In Progress" />
                        <Tab label="Resolved" />
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="status-filter-label">Status Filter</InputLabel>
                                    <Select
                                        labelId="status-filter-label"
                                        value={ticketFilter.status}
                                        onChange={(e) => setTicketFilter({ ...ticketFilter, status: e.target.value })}
                                        label="Status Filter"
                                        sx={{ '& .MuiSelect-select': { py: 1.5 }, fontFamily: 'Inter, sans-serif' }}
                                    >
                                        <MenuItem sx={{ fontFamily: 'Inter, sans-serif' }} value="">All</MenuItem>
                                        <MenuItem sx={{ fontFamily: 'Inter, sans-serif' }} value="OPEN">Open</MenuItem>
                                        <MenuItem sx={{ fontFamily: 'Inter, sans-serif' }} value="IN_PROGRESS">In Progress</MenuItem>
                                        <MenuItem sx={{ fontFamily: 'Inter, sans-serif' }} value="RESOLVED">Resolved</MenuItem>
                                        <MenuItem sx={{ fontFamily: 'Inter, sans-serif' }} value="CLOSED">Closed</MenuItem>
                                        <MenuItem sx={{ fontFamily: 'Inter, sans-serif' }} value="REJECTED">Rejected</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="type-filter-label">Type Filter</InputLabel>
                                    <Select
                                        labelId="type-filter-label"
                                        value={ticketFilter.type}
                                        onChange={(e) => setTicketFilter({ ...ticketFilter, type: e.target.value })}
                                        label="Type Filter"
                                        sx={{ '& .MuiSelect-select': { py: 1.5 }, fontFamily: 'Inter, sans-serif' }}
                                    >
                                        <MenuItem sx={{ fontFamily: 'Inter, sans-serif' }} value="">All</MenuItem>
                                        {stats?.byType?.map((type) => (
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif' }} key={type.type} value={type.type}>
                                                {type.type.replace(/_/g, ' ')}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                {/* Tickets Table */}
                <Paper sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                    <TableContainer sx={{
                        maxHeight: 600,
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        },
                        scrollbarWidth: 'none'
                    }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell sx={{
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        fontWeight: 600,
                                        fontSize: '0.875rem'
                                    }}>
                                        Ticket Number
                                    </StyledTableCell>
                                    <StyledTableCell sx={{
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        fontWeight: 600,
                                        fontSize: '0.875rem'
                                    }}>
                                        Type
                                    </StyledTableCell>
                                    <StyledTableCell sx={{
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        fontWeight: 600,
                                        fontSize: '0.875rem'
                                    }}>
                                        Status
                                    </StyledTableCell>
                                    <StyledTableCell sx={{
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        fontWeight: 600,
                                        fontSize: '0.875rem'
                                    }}>
                                        Created At
                                    </StyledTableCell>
                                    <StyledTableCell sx={{
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        fontWeight: 600,
                                        fontSize: '0.875rem'
                                    }}>
                                        Priority
                                    </StyledTableCell>
                                    <StyledTableCell
                                        align="right"
                                        sx={{
                                            backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <StyledTableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                            <CircularProgress size={40} thickness={4} />
                                        </StyledTableCell>
                                    </TableRow>
                                ) : tickets.length === 0 ? (
                                    <TableRow>
                                        <StyledTableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                No tickets found
                                            </Typography>
                                        </StyledTableCell>
                                    </TableRow>
                                ) : (
                                    tickets.map((ticket) => (
                                        <StyledTableRow key={ticket.id}>
                                            <StyledTableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {ticket.ticketNumber}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <TicketTypeChip
                                                    label={ticket.type.replace(/_/g, ' ')}
                                                    size="small"
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <StatusChip
                                                    label={ticket.status}
                                                    status={ticket.status}
                                                    size="small"
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography variant="body2">
                                                    {new Date(ticket.createdAt).toLocaleString()}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Chip
                                                    label={ticket.priority === 0 ? 'Normal' : `Priority ${ticket.priority}`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: ticket.priority === 2 ? '#FEE2E2' :
                                                            ticket.priority === 1 ? '#FEF3C7' : '#F3F4F6',
                                                        color: ticket.priority === 2 ? '#DC2626' :
                                                            ticket.priority === 1 ? '#D97706' : '#374151',
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem',
                                                        height: '24px'
                                                    }}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell align="right">
                                                <Tooltip title="View Details">
                                                    <IconButton
                                                        onClick={() => {
                                                            setSelectedTicket(ticket);
                                                            setStatusUpdate({
                                                                status: ticket.status,
                                                                priority: ticket.priority.toString(),
                                                            });
                                                            setOpenDialog(true);
                                                            setDialogTab(0);
                                                        }}
                                                        sx={{
                                                            color: '#6B7280',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                                color: '#6366f1'
                                                            }
                                                        }}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={totalTickets}
                        page={page}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        sx={{
                            borderTop: '1px solid rgba(148, 163, 184, 0.12)',
                            '.MuiTablePagination-select': {
                                paddingRight: '24px'
                            },
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                margin: 0
                            }
                        }}
                    />
                </Paper>

                {/* Ticket Details Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '16px',
                            background: 'linear-gradient(145deg, #1e293b 0%, rgba(99, 102, 241, 0.05) 100%)',
                            border: '1px solid rgba(148, 163, 184, 0.12)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(148, 163, 184, 0.12)'
                    }}>
                        <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }} >
                            Ticket Details - {selectedTicket?.ticketNumber}
                        </Typography>
                        <IconButton
                            onClick={() => setOpenDialog(false)}
                            sx={{
                                color: '#6B7280',
                                '&:hover': {
                                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                    color: '#f8fafc'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={dialogTab}
                            onChange={handleDialogTabChange}
                            sx={{
                                px: 3,
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    minHeight: '48px',
                                    fontFamily: 'Inter, sans-serif',
                                }
                            }}
                        >
                            <Tab label="Details" />
                            <Tab label="Messages" />
                            <Tab label="Attachments" />
                        </Tabs>
                    </Box>

                    <DialogContent sx={{
                        p: 0,
                        fontFamily: 'Inter, sans-serif',

                    }}>
                        <TabPanel value={dialogTab} index={0}>
                            {updateError && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {updateError}
                                </Alert>
                            )}

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <DetailRow>
                                        <DetailLabel>Status:</DetailLabel>
                                        <DetailValue>
                                            <StatusChip
                                                sx={{
                                                    fontFamily: 'Inter, sans-serif',

                                                }}
                                                label={selectedTicket?.status}
                                                status={selectedTicket?.status}
                                                size="small"
                                            />
                                        </DetailValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DetailLabel>Type:</DetailLabel>
                                        <DetailValue>
                                            <TicketTypeChip
                                                label={selectedTicket?.type.replace(/_/g, ' ')}
                                                size="small"
                                            />
                                        </DetailValue>
                                    </DetailRow>
                                    <DetailRow>
                                        <DetailLabel>Created:</DetailLabel>
                                        <DetailValue>
                                            {selectedTicket?.createdAt &&
                                                new Date(selectedTicket.createdAt).toLocaleString()}
                                        </DetailValue>
                                    </DetailRow>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <DetailRow>
                                        <DetailLabel>Priority:</DetailLabel>
                                        <DetailValue>
                                            <Chip
                                                label={selectedTicket?.priority === 0 ? 'Normal' :
                                                    `Priority ${selectedTicket?.priority}`}
                                                size="small"
                                                sx={{
                                                    fontFamily: 'Inter, sans-serif',

                                                    backgroundColor: selectedTicket?.priority === 2 ? '#FEE2E2' :
                                                        selectedTicket?.priority === 1 ? '#FEF3C7' : '#F3F4F6',
                                                    color: selectedTicket?.priority === 2 ? '#DC2626' :
                                                        selectedTicket?.priority === 1 ? '#D97706' : '#374151',
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem',
                                                    height: '24px'
                                                }}
                                            />
                                        </DetailValue>
                                    </DetailRow>
                                    {selectedTicket?.ticketDetails &&
                                        Object.entries(selectedTicket.ticketDetails).map(([key, value]) => (
                                            <DetailRow key={key}>
                                                <DetailLabel>{key}:</DetailLabel>
                                                <DetailValue>
                                                    {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                                                </DetailValue>
                                            </DetailRow>
                                        ))
                                    }
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" fontWeight={600}
                                sx={{
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 600
                                }}
                                gutterBottom>
                                Update Status
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel
                                            sx={{
                                                fontFamily: 'Inter, sans-serif',

                                            }}
                                            id="status-update-label">Status</InputLabel>
                                        <Select
                                            labelId="status-update-label"
                                            value={statusUpdate.status}
                                            onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                            label="Status"
                                            sx={{
                                                '& .MuiSelect-select': { py: 1.5 },
                                                fontFamily: 'Inter, sans-serif',

                                            }}
                                        >
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif', }} value="OPEN">Open</MenuItem>
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif', }} value="IN_PROGRESS">In Progress</MenuItem>
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif', }} value="RESOLVED">Resolved</MenuItem>
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif', }} value="CLOSED">Closed</MenuItem>
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif', }} value="REJECTED">Rejected</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel
                                            sx={{
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                            id="priority-update-label">Priority</InputLabel>
                                        <Select
                                            labelId="priority-update-label"
                                            value={statusUpdate.priority}
                                            onChange={(e) => setStatusUpdate({ ...statusUpdate, priority: e.target.value })}
                                            label="Priority"
                                            sx={{
                                                '& .MuiSelect-select': { py: 1.5 },

                                                fontFamily: 'Inter, sans-serif',

                                            }}
                                        >
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif', }} value="0">Normal</MenuItem>
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif', }} value="1">High</MenuItem>
                                            <MenuItem sx={{ fontFamily: 'Inter, sans-serif', }} value="2">Critical</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        <TabPanel value={dialogTab} index={1}>
                            {selectedTicket?.ticketMessages?.length > 0 ? (
                                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                                    {selectedTicket.ticketMessages.map((message) => (
                                        <Card
                                            key={message.id}
                                            sx={{
                                                mb: 2,
                                                bgcolor: message.isStaffMessage ? 'rgba(99, 102, 241, 0.1)' : '#1e293b',
                                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                                borderRadius: '12px',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                        >
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    sx={{ mb: 1, display: 'block', fontFamily: 'Inter, sans-serif', }}
                                                >
                                                    {new Date(message.createdAt).toLocaleString()}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif', }}
                                                >
                                                    {message.message}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            ) : (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', py: 4 }}
                                >
                                    No messages found
                                </Typography>
                            )}
                        </TabPanel>

                        <TabPanel value={dialogTab} index={2}>
                            {selectedTicket?.ticketAttachments?.length > 0 ? (
                                <Grid container spacing={2}>
                                    {selectedTicket.ticketAttachments.map((attachment) => (
                                        <Grid item xs={12} sm={6} md={4} key={attachment.id}>
                                            <Card
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                                    }
                                                }}
                                                onClick={() => handleImageClick(attachment.fileUrl)}
                                            >
                                                <CardContent sx={{ p: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <AttachFileIcon sx={{ color: '#6B7280' }} />
                                                        <Typography
                                                            sx={{ fontFamily: 'Inter, sans-serif', }}
                                                            variant="body2" noWrap>
                                                            {attachment.fileName}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ textAlign: 'center', py: 4 }}
                                >
                                    No attachments found
                                </Typography>
                            )}
                        </TabPanel>
                    </DialogContent>

                    <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStatusUpdate}
                            variant="contained"
                            disabled={statusUpdateLoading}
                            startIcon={statusUpdateLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                px: 3,
                                fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            Update Status
                        </Button>
                    </DialogActions>

                    {/* Image Preview Dialog */}
                    <ImageDialog
                        open={imageDialogOpen}
                        onClose={() => setImageDialogOpen(false)}
                        imageUrl={selectedImage}
                    />
                </Dialog>
                </Box>
            </GlobalStyles>
        </ThemeProvider>
    );
}

export default SupportTicketSystem;