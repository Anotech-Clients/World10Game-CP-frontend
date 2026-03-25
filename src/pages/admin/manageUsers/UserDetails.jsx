import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import {
  Person as PersonIcon,
  AccountBalanceWallet as WalletIcon,
  Fingerprint as FingerprintIcon,
  Phone as PhoneIcon,
  Login as LoginIcon,
  History as HistoryIcon,
  Block as BlockIcon,
  AccountBalance as BankIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  SearchRounded as SearchIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material'
import { useAuth } from '../../../context/AuthContext'
import { domain } from '../../../utils/Secret'
import BankDetailsModal from '../../../components/admin/manageUser/BankDetailsModal'
import WalletUpdateModal from '../../../components/admin/manageUser/WalletUpdateModal'

// Dark theme for components
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
})

const DETAILS_FULLFORM_MAP = {
  // Manual Deposit
  MDR: 'Manual Deposit Request',
  MDF: 'Manual Deposit Failed',
  MDC: 'Manual Deposit Complete',

  // USDT Deposit
  USDTR: 'USDT Deposit Request',
  USDTF: 'USDT Deposit Failed',
  USDTC: 'USDT Deposit Complete',

  // Manual Withdrawal
  MWR: 'Manual Withdrawal Request',
  MWF: 'Manual Withdrawal Failed',
  MWC: 'Manual Withdrawal Complete',

  // Bonus types
  DR: 'Daily Reward',
  DB: 'Deposit Bonus',
  AB: 'Attendance Bonus',
  IB: 'Invitation Bonus',
  RB: 'Rebate Bonus',
  RE: 'Red Envelope',
  COMMISSION: 'Commission',

  // VIP
  'VIP MR': 'VIP Monthly Reward',
  'VIP OTB': 'VIP One Time Bonus',

  // Other
  WSB: 'Winning Streak Bonus',
  UBA: 'User Balance Admin',
  SP: 'Salary Person',
  L10IR: 'Lucky 10 Interest Reward',
  RPB: 'Recharge Percentage Bonus',
  RRB: 'Refer Bonus',

  // Games
  WINGO: 'Wingo',
  K3: 'K3',
}

const getDetailsFullForm = (code) => {
  if (DETAILS_FULLFORM_MAP[code]) return DETAILS_FULLFORM_MAP[code]

  // Handle prefix-based matches like "DB 1", "AB 2", etc.
  const prefix = Object.keys(DETAILS_FULLFORM_MAP).find((key) =>
    code.startsWith(key + ' ')
  )

  return DETAILS_FULLFORM_MAP[prefix] || code
}


const InfoCard = ({ icon, title, value, color }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: { xs: '120px', sm: '140px' },
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
        }
      }}
    >
      <CardContent sx={{ height: '100%', p: { xs: 2, sm: 3 } }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ height: '100%' }}
        >
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2,
              p: { xs: 1.5, sm: 2 },
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, {
              sx: { color: 'white', fontSize: { xs: 28, sm: 36 } }
            })}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                letterSpacing: '0.5px',
                mb: 0.5,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                wordBreak: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

const TransactionHistory = ({ userId }) => {
  const { axiosInstance } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [transactions, setTransactions] = useState({ data: [], total: 0 })
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  })

  const depositStatuses = ['PENDING', 'SUCCESS', 'CANCELLED']
  const withdrawalStatuses = ['PENDING', 'COMPLETED', 'REJECTED']

  useEffect(() => {
    fetchTransactions()
  }, [activeTab, page, filters])

  const fetchTransactions = async () => {
    try {
      const endpoint = activeTab === 0 ? 'deposits' : 'withdrawals'
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      })

      const { data } = await axiosInstance.get(
        `${domain}/api/admin/members/users/${userId}/${endpoint}?${queryParams}`,
        { withCredentials: true }
      )
      setTransactions(data.data)
    } catch (error) {
      console.error(`Error fetching ${activeTab === 0 ? 'deposit' : 'withdrawal'} history:`, error)
    }
  }

  const handleReset = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
    })
    setPage(1)
  }

  const getStatusColor = (status) => {
    const colors = {
      SUCCESS: '#15803d',
      COMPLETED: '#15803d',
      PENDING: '#ca8a04',
      CANCELLED: '#dc2626',
      REJECTED: '#dc2626',
    }
    return colors[status] || '#64748b'
  }

 const formatDate = (dateString) => {
  // Create a date object from the input string
  const originalDate = new Date(dateString);
  // Subtract 5 hours and 30 minutes (330 minutes total)
  const adjustedDate = new Date(originalDate.getTime() - (330 * 60 * 1000));
  // Format the adjusted date
  return adjustedDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

  return (
    <Card sx={{
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      mt: 3,
      background: 'linear-gradient(to bottom, #1e293b, rgba(99, 102, 241, 0.05))',
    }}>
      <CardContent>
        {/* Tab Switcher */}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue)
              setPage(1)
              handleReset()
            }}
            sx={{
              '& .MuiTab-root': {
                fontFamily: 'Inter, sans-serif',
                textTransform: 'none',
                fontWeight: 600,
              }
            }}
          >
            <Tab label="Deposits" />
            <Tab label="Withdrawals" />
          </Tabs>
        </Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              sx={{
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                },
                '& .MuiMenuItem-root': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
            >
              <MenuItem sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }} value="">ALL</MenuItem>
              {(activeTab === 0 ? depositStatuses : withdrawalStatuses).map((status) => (
                <MenuItem sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }} key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
              inputProps={{
                max: filters.endDate || new Date().toISOString().split('T')[0],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
              inputProps={{
                min: filters.startDate,
                max: new Date().toISOString().split('T')[0],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={() => setPage(1)}
                sx={{
                  height: '56px',
                  backgroundColor: '#2563eb',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  height: '56px',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                <ResetIcon />
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <TableContainer
          sx={{
            overflow: 'auto', // Enable scrolling
            '&::-webkit-scrollbar': {
              display: 'none', // Hide scrollbar for Chrome, Safari, and Opera
            },
            scrollbarWidth: 'none', // Hide scrollbar for Firefox
            msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>
                  {activeTab === 0 ? 'Deposit ID' : 'Transaction ID'}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>
                  Method
                </TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>
                  Status
                </TableCell>
                {activeTab === 0 && (
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>
                    Gateway
                  </TableCell>
                )}
                {/* Show Remarks column only for withdrawals */}
                {activeTab !== 0 && (
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>
                    Remarks
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.data.map((transaction, index) => (
                <TableRow
                  key={transaction.id}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'rgba(99, 102, 241, 0.03)',
                    },
                    '&:nth-of-type(even)': {
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    },
                  }}
                >
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                    {activeTab === 0 ? transaction.depositId : transaction.transactionId}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                    pkr {activeTab === 0 ? transaction.depositAmount : transaction.withdrawAmount}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                    {activeTab === 0 ? transaction.depositMethod : transaction.withdrawMethod}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                    {formatDate(activeTab === 0 ? transaction.depositDate : transaction.withdrawDate)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block',
                        backgroundColor: `${getStatusColor(activeTab === 0 ? transaction.depositStatus : transaction.withdrawStatus)}15`,
                        color: getStatusColor(activeTab === 0 ? transaction.depositStatus : transaction.withdrawStatus),
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 500,
                      }}
                    >
                      {activeTab === 0 ? transaction.depositStatus : transaction.withdrawStatus}
                    </Box>
                  </TableCell>
                  {/* Show Gateway column only for deposits */}
                  {activeTab === 0 && (
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                      {transaction.paymentGatewayName === 'NA' ? 'Manual' : transaction.paymentGatewayName}
                    </TableCell>
                  )}
                  {/* Show Remarks column only for withdrawals */}
                  {activeTab !== 0 && (
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                      {transaction.remarks || '-'}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {transactions.total > 0 ? (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(transactions.total / limit)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
            />
          </Box>
        ) : (
          <Typography
            sx={{
              textAlign: 'center',
              py: 3,
              color: '#94a3b8',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            No transactions found
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}


const BettingHistory = ({ userId }) => {
  const { axiosInstance } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [bets, setBets] = useState({ data: [], total: 0 })
  const [filters, setFilters] = useState({
    gameType: 'WINGO',
    startDate: '',
    endDate: '',
  })

  const gameTypes = ['WINGO', 'K3', 'FIVED', 'CAR_RACE']

  useEffect(() => {
    fetchBets()
  }, [page, filters])

  const fetchBets = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.gameType && { gameType: filters.gameType }),
      })

      const { data } = await axiosInstance.get(
        `${domain}/api/admin/members/users/${userId}/bets?${queryParams}`,
        { withCredentials: true }
      )
      setBets(data.data)
    } catch (error) {
      console.error('Error fetching betting history:', error)
    }
  }

  const handleReset = () => {
    setFilters({
      gameType: 'WINGO',
      startDate: '',
      endDate: '',
    })
    setPage(1)
  }

  const formatDate = (dateString) => {
  // Create a date object from the input string
  const originalDate = new Date(dateString);
  // Subtract 5 hours and 30 minutes (330 minutes total)
  const adjustedDate = new Date(originalDate.getTime() - (330 * 60 * 1000));
  // Format the adjusted date
  return adjustedDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

  const formatFivedBetType = (betType) => {
    const betTypeMap = {
      'SECTION_A': 'Section A',
      'SUM': 'Sum Bet',
      // Add more mappings as needed
      default: betType
    }
    return betTypeMap[betType] || betTypeMap.default
  }

  const formatFivedChoice = (bet) => {
    if (!bet || !bet.betType) return '-'

    switch (bet.betType) {
      case 'SECTION_A':
        const sectionSelections = []

        // Section A number selections
        if (bet.sectionA && bet.sectionA.length > 0) {
          sectionSelections.push(`Numbers: ${bet.sectionA.join(', ')}`)
        }

        // Parity selections
        const paritySelections = []
        if (bet.parityA && bet.parityA.length > 0) {
          paritySelections.push(`Parity A: ${bet.parityA.join(', ')}`)
        }
        if (bet.parityB && bet.parityB.length > 0) {
          paritySelections.push(`Parity B: ${bet.parityB.join(', ')}`)
        }
        if (bet.parityC && bet.parityC.length > 0) {
          paritySelections.push(`Parity C: ${bet.parityC.join(', ')}`)
        }
        if (bet.parityD && bet.parityD.length > 0) {
          paritySelections.push(`Parity D: ${bet.parityD.join(', ')}`)
        }
        if (bet.parityE && bet.parityE.length > 0) {
          paritySelections.push(`Parity E: ${bet.parityE.join(', ')}`)
        }

        return [...sectionSelections, ...paritySelections].join(' • ')

      case 'SUM':
        const sumChoices = []

        // Size sum (Big/Small)
        if (bet.sizeSum) {
          sumChoices.push(`Size: ${bet.sizeSum}`)
        }

        // Parity sum (Odd/Even)
        if (bet.paritySum) {
          sumChoices.push(`Parity: ${bet.paritySum}`)
        }

        return sumChoices.length > 0 ? sumChoices.join(' • ') : 'Sum Bet'

      default:
        return bet.betType || '-'
    }
  }

  const formatFivedResult = (bet) => {
    if (!bet) return '-'

    const resultSections = [
      { section: 'A', result: bet.resultSectionA?.[0] ?? '-' },
      { section: 'B', result: bet.resultSectionB?.[0] ?? '-' },
      { section: 'C', result: bet.resultSectionC?.[0] ?? '-' },
      { section: 'D', result: bet.resultSectionD?.[0] ?? '-' },
      { section: 'E', result: bet.resultSectionE?.[0] ?? '-' }
    ]

    const resultDisplay = resultSections
      .map(section => `${section.section}: ${section.result}`)
      .join(' • ')

    return `${resultDisplay} (Sum: ${bet.resultSum ?? '-'})`
  }

  const renderFivedRow = (bet) => (
    <TableRow
      key={bet.id}
      sx={{
        '&:nth-of-type(odd)': { backgroundColor: 'rgba(99, 102, 241, 0.03)' },
        '&:nth-of-type(even)': { backgroundColor: 'rgba(99, 102, 241, 0.05)' },
        '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' },
      }}
    >
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.periodId || '-'}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.betAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.multiplier || 1}x</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.tax || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.actualBetAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
        {formatFivedBetType(bet.betType)}
      </TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', maxWidth: 250 }}>
        {formatFivedChoice(bet)}
      </TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', maxWidth: 250 }}>
        {formatFivedResult(bet)}
      </TableCell>
      <TableCell>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-block',
            backgroundColor: bet.isWin ? '#15803d15' : '#dc262615',
            color: bet.isWin ? '#15803d' : '#dc2626',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          {bet.isWin ? 'Win' : 'Loss'}
        </Box>
      </TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.winAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatDate(bet.timestamp)}</TableCell>
    </TableRow>
  )

  const formatWingoResult = (result) => {
    if (!result) return '-'
    const parts = result.split('|')
    return parts.join(' • ')
  }

  const formatK3Choice = (bet) => {
    if (!bet || !bet.betType) return '-'

    switch (bet.betType) {
      case 'BIG_SMALL':
        return bet.isBig ? 'Big' : 'Small'
      case 'ODD_EVEN':
        return bet.isOdd ? 'Odd' : 'Even'
      case 'TOTAL_SUM':
        return `Sum: ${bet.totalSum || '-'}`
      case 'TWO_SAME':
        return `Two Same: ${bet.twoSameNumber || '-'}`
      case 'TWO_SAME_SPECIFIC':
        return `Two Same: ${bet.twoSameNumber || '-'}, Third: ${bet.thirdNumber || '-'}`
      case 'THREE_SAME':
        return `Three Same: ${bet.threeSameNumber || '-'}`
      case 'ALL_DIFFERENT':
        return `All Different: ${bet.selectedNumbers?.join(', ') || '-'}`
      case 'TWO_DIFFERENT':
        return `Two Different: ${bet.selectedNumbers?.join(', ') || '-'}`
      default:
        return '-'
    }
  }

  const formatBetType = (betType) => {
    if (!betType) return '-'
    return betType.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ')
  }

  const formatK3Result = (dice) => {
    if (!dice || !Array.isArray(dice) || dice.length === 0) return '-'
    return dice.join(' • ')
  }

  // New function for formatting CAR_RACE choices
  const formatCarRaceChoice = (bet) => {
    if (!bet || !bet.sectionElements || !bet.sectionElements.length) return '-'

    const sectionElement = bet.sectionElements[0]
    const choices = []

    // Car numbers
    if (sectionElement.carNumbers && sectionElement.carNumbers.length > 0) {
      choices.push(`Cars: ${sectionElement.carNumbers.join(', ')}`)
    }

    // Sizes (Big/Small)
    if (sectionElement.sizes && sectionElement.sizes.length > 0) {
      choices.push(`Sizes: ${sectionElement.sizes.join(', ')}`)
    }

    // Parities (Odd/Even)
    if (sectionElement.parities && sectionElement.parities.length > 0) {
      choices.push(`Parities: ${sectionElement.parities.join(', ')}`)
    }

    return choices.length > 0 ? choices.join(' • ') : '-'
  }

  // New function for formatting CAR_RACE results
  const formatCarRaceResult = (bet) => {
    if (!bet || !bet.resultElements) return '-'

    const results = []
    const { firstPlace, secondPlace, thirdPlace } = bet.resultElements

    if (firstPlace !== undefined) results.push(`1st: ${firstPlace}`)
    if (secondPlace !== undefined) results.push(`2nd: ${secondPlace}`)
    if (thirdPlace !== undefined) results.push(`3rd: ${thirdPlace}`)

    return results.length > 0 ? results.join(' • ') : '-'
  }

  const renderWingoRow = (bet) => (
    <TableRow
      key={bet.id}
      sx={{
        '&:nth-of-type(odd)': {
          backgroundColor: 'rgba(99, 102, 241, 0.03)',
        },
        '&:nth-of-type(even)': {
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
        },
        '&:hover': {
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
        },
      }}
    >
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.periodId || '-'}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.betAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.multiplier || 1}x</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.tax || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.actualBetAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.selectedItem || '-'}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatWingoResult(bet.result)}</TableCell>
      <TableCell>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-block',
            backgroundColor: bet.isWin ? '#15803d15' : '#dc262615',
            color: bet.isWin ? '#15803d' : '#dc2626',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          {bet.isWin ? 'Win' : 'Loss'}
        </Box>
      </TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.winAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatDate(bet.timestamp)}</TableCell>
    </TableRow>
  )

  const renderK3Row = (bet) => (
    <TableRow
      key={bet.id}
      sx={{
        '&:nth-of-type(odd)': {
          backgroundColor: 'rgba(99, 102, 241, 0.03)',
        },
        '&:nth-of-type(even)': {
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
        },
        '&:hover': {
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
        },
      }}
    >
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.periodId || '-'}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.betAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.multiplier || 1}x</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.tax || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.actualBetAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
        {formatBetType(bet.betType)}
      </TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatK3Choice(bet)}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatK3Result(bet.resultDice)}</TableCell>
      <TableCell>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-block',
            backgroundColor: bet.isWin ? '#15803d15' : '#dc262615',
            color: bet.isWin ? '#15803d' : '#dc2626',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          {bet.isWin ? 'Win' : 'Loss'}
        </Box>
      </TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.winAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatDate(bet.timestamp)}</TableCell>
    </TableRow>
  )

  // New function to render CAR_RACE rows
  const renderCarRaceRow = (bet) => (
    <TableRow
      key={bet.id}
      sx={{
        '&:nth-of-type(odd)': {
          backgroundColor: 'rgba(99, 102, 241, 0.03)',
        },
        '&:nth-of-type(even)': {
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
        },
        '&:hover': {
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
        },
      }}
    >
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.periodId || '-'}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.betAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{bet.multiplier || 1}x</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.tax || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.actualBetAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
        {formatBetType(bet.selectedSection || 'NONE')}
      </TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatCarRaceChoice(bet)}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatCarRaceResult(bet)}</TableCell>
      <TableCell>
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-block',
            backgroundColor: bet.isWin ? '#15803d15' : '#dc262615',
            color: bet.isWin ? '#15803d' : '#dc2626',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          }}
        >
          {bet.isWin ? 'Win' : 'Loss'}
        </Box>
      </TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>pkr {bet.winAmount || 0}</TableCell>
      <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatDate(bet.timestamp)}</TableCell>
    </TableRow>
  )

  return (
    <Card sx={{
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      mt: 3,
      background: 'linear-gradient(to bottom, #1e293b, rgba(99, 102, 241, 0.05))',
    }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            mb: 3,
            color: '#f8fafc'
          }}
        >
          Betting History
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Game Type"
              value={filters.gameType}
              onChange={(e) => setFilters({ ...filters, gameType: e.target.value })}
              sx={{
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500
                },
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                },
                '& .MuiMenuItem-root': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
            >
              {gameTypes.map((type) => (
                <MenuItem
                  key={type}
                  value={type}
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500
                  }}
                >
                  {type === 'CAR_RACE' ? 'CAR RACE' : type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
              inputProps={{
                max: filters.endDate || new Date().toISOString().split('T')[0],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
              inputProps={{
                min: filters.startDate,
                max: new Date().toISOString().split('T')[0],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={() => setPage(1)}
                sx={{
                  height: '56px',
                  backgroundColor: '#2563eb',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  height: '56px',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                <ResetIcon />
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <TableContainer
          sx={{
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Period ID</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Bet Amount</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Multiplier</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Tax</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Actual Amount</TableCell>
                {filters.gameType === 'WINGO' ? (
                  <>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Selected Item</TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Result</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Bet Type</TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Choice</TableCell>
                    <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>
                      {filters.gameType === 'K3' ? 'Result Dice' : 'Result'}
                    </TableCell>
                  </>
                )}
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Status</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Win Amount</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bets.data.map((bet) => {
                switch (filters.gameType) {
                  case 'WINGO':
                    return renderWingoRow(bet)
                  case 'K3':
                    return renderK3Row(bet)
                  case 'FIVED':
                    return renderFivedRow(bet)
                  case 'CAR_RACE':
                    return renderCarRaceRow(bet)
                  default:
                    return null
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {bets.total > 0 ? (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(bets.total / limit)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
            />
          </Box>
        ) : (
          <Typography
            sx={{
              textAlign: 'center',
              py: 3,
              color: '#94a3b8',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            No bets found
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

const BonusHistory = ({ userId }) => {
  const { axiosInstance } = useAuth()

  const [page, setPage] = useState(1)
  const [totalBonus, setTotalBonus] = useState(0)
  const [limit] = useState(10)
  const [bonus, setBonus] = useState({ data: [], total: 0 })
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    fetchBonus()
  }, [page, filters])

  const fetchBonus = async () => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      })

      const { data } = await axiosInstance.get(
        `${domain}/api/admin/members/users/${userId}/bonus?${queryParams}`,
        { withCredentials: true }
      )
      setBonus(data.data)
      setTotalBonus(data.data.totalBonusAmount || 0)
    } catch (error) {
      console.error('Error fetching betting history:', error)
    }
  }

  const handleReset = () => {
    setFilters({
      gameType: 'WINGO',
      startDate: '',
      endDate: '',
    })
    setPage(1)
  }

  const formatDate = (dateString) => {
  // Create a date object from the input string
  const originalDate = new Date(dateString);
  // Subtract 5 hours and 30 minutes (330 minutes total)
  const adjustedDate = new Date(originalDate.getTime() - (330 * 60 * 1000));
  // Format the adjusted date
  return adjustedDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

  return (
    <Card sx={{
      borderRadius: 2,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      mt: 3,
      background: 'linear-gradient(to bottom, #1e293b, rgba(99, 102, 241, 0.05))',
    }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            mb: 3,
            color: '#f8fafc'
          }}
        >
          Bonus History
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="body1"
              type="text"
              fontWeight={600}
              fullWidth
              sx={{ color: '#f8fafc' }}
            >
              {`Total Bonus: pkr ${totalBonus}`}
              </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
              inputProps={{
                max: filters.endDate || new Date().toISOString().split('T')[0],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputLabel-root': {
                  fontFamily: 'Inter, sans-serif',
                },
                '& .MuiInputBase-input': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
              inputProps={{
                min: filters.startDate,
                max: new Date().toISOString().split('T')[0],
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={() => setPage(1)}
                sx={{
                  height: '56px',
                  backgroundColor: '#2563eb',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  height: '56px',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                <ResetIcon />
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <TableContainer
          sx={{
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Sl. No.</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Details</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Transaction Type</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Amount</TableCell>
                <TableCell sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#f8fafc' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bonus.data.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{index + 1}</TableCell> 
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                    {getDetailsFullForm(entry.details)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{entry.transactionType}</TableCell>
                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{entry.amount}</TableCell>

                  <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>{formatDate(entry.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {bonus.total > 0 ? (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(bonus.total / limit)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontFamily: 'Inter, sans-serif',
                }
              }}
            />
          </Box>
        ) : (
          <Typography
            sx={{
              textAlign: 'center',
              py: 3,
              color: '#94a3b8',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            No bets found
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

const SubordinateCard = ({ title, icon, stats, gradient }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: { xs: '200px', sm: '220px' },
        borderRadius: 3,
        background: gradient,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          transform: 'translate(30%, -30%)',
        }}
      />
      <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 2, sm: 3 } }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          {React.cloneElement(icon, {
            sx: { color: 'white', fontSize: { xs: 24, sm: 28 } }
          })}
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: 'white',
              letterSpacing: '-0.5px',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: { xs: 1.5, sm: 2 },
                height: '100%',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  mb: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Total Registrations
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '-1px',
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {stats.registrations}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: { xs: 1.5, sm: 2 },
                height: '100%',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  mb: 1,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                Total Deposits
              </Typography>
              <Stack direction="column" spacing={0.5}>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '-1px',
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}
                >
                  {stats.deposits}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  pkr {stats.amount}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const actionButtonStyles = {
  py: { xs: 1, sm: 1.5 },
  px: { xs: 2, sm: 3 },
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  borderRadius: 2,
  textTransform: 'none',
  fontSize: { xs: '0.875rem', sm: '1rem' },
  whiteSpace: 'nowrap',
  minHeight: { xs: '40px', sm: '48px' },
}

// Update table styles:
const tableHeaderStyles = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  color: '#1e293b',
  padding: { xs: 1, sm: 2 },
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
}

const tableCellStyles = {
  fontFamily: 'Inter, sans-serif',
  padding: { xs: 1, sm: 2 },
  fontSize: { xs: '0.75rem', sm: '0.875rem' },
}

const UserDetails = () => {
  const { id } = useParams()
  const { axiosInstance } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bankModalOpen, setBankModalOpen] = useState(false)
  const [canWithdraw, setCanWithdraw] = useState(true)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [editBankAccount, setEditBankAccount] = useState(null)
  const [isLocked, setIsLocked] = useState(false) // Track user lock status
  const [confirmModalOpen, setConfirmModalOpen] = useState(false) // Confirmation modal state

  useEffect(() => {
    fetchUserDetails()
  }, [id])

  const fetchUserDetails = async () => {
    try {
      const { data } = await axiosInstance.get(
        `${domain}/api/admin/members/users/${id}`,
        { withCredentials: true }
      )
      setUserData(data.data)
      setLoading(false)
      setCanWithdraw(data.data.canWithdraw) // Set initial withdraw status
      setIsLocked(data.data.personalInfo.isLocked) // Set initial lock status from API response
    } catch (error) {
      console.error('Error fetching user details:', error)
      setLoading(false)
    }
  }

  const handleBanUnban = async () => {
    try {
      const { data } = await axiosInstance.patch(
        `${domain}/api/admin/members/users/${id}/lock`,
        { isLocked: !isLocked }, // Toggle lock status
        { withCredentials: true }
      )
      setIsLocked(!isLocked) // Update lock status in UI
      setConfirmModalOpen(false) // Close confirmation modal
    } catch (error) {
      console.error('Error updating lock status:', error)
    }
  }

  const handleBanWithdraw = async (canWithdraw) => {
    try {
      const { data } = await axiosInstance.put(
        `${domain}/api/admin/turn-over/can-wihtdraw/${id}`,
        { canWithdraw }, // Toggle withdraw status
        { withCredentials: true }
      )
      setCanWithdraw(canWithdraw)
      //console.log('Withdraw status updated:', data)

    } catch (error) {
      console.error('Error updating withdraw status:', error)
    }
  }

  if (loading) {
    return (
      <Typography sx={{ fontFamily: 'Inter, sans-serif' }}>
        Loading...
      </Typography>
    )
  }

  if (!userData) {
    return (
      <Typography sx={{ fontFamily: 'Inter, sans-serif' }}>
        No user data found
      </Typography>
    )
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ p: 3, bgcolor: '#0f172a', minHeight: '100vh', borderRadius: '16px' }}>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            icon={<PersonIcon />}
            title="Username"
            value={userData.personalInfo.userName}
            color="#2563eb"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            icon={<WalletIcon />}
            title="Wallet Amount"
            value={`pkr ${parseFloat(userData.personalInfo.walletBalance).toFixed(3)}`}
            color="#059669"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            icon={<FingerprintIcon />}
            title="UID"
            value={userData.personalInfo.uid}
            color="#7c3aed"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard
            icon={<PhoneIcon />}
            title="Mobile Number"
            value={userData.personalInfo.mobile}
            color="#ea580c"
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  backgroundColor: '#dc2626',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                  '&:hover': {
                    backgroundColor: '#b91c1c',
                  }
                }}
              >
                Login as User
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {canWithdraw ?
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<HistoryIcon />}
                  onClick={() => handleBanWithdraw(false)}
                  sx={{
                    py: 1.5,
                    backgroundColor: '#2563eb',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    }
                  }}
                >
                  Active Withdraw
                </Button>
                :
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<HistoryIcon />}
                  onClick={() => handleBanWithdraw(true)}
                  sx={{
                    py: 1.5,
                    backgroundColor: '#2563eb',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    }
                  }}
                >
                  Inavtive Withdraw
                </Button>
              }
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {/* <Button
                fullWidth
                variant="contained"
                startIcon={<WalletIcon />}
                onClick={() => setWalletModalOpen(true)}
                sx={{
                  py: 1.5,
                  backgroundColor: '#16a34a',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                  '&:hover': {
                    backgroundColor: '#15803d',
                  }
                }}
              >
                Wallet Update
              </Button> */}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {/* <Button
                fullWidth
                variant="contained"
                startIcon={<BlockIcon />}
                onClick={() => setConfirmModalOpen(true)} // Open confirmation modal
                sx={{
                  py: 1.5,
                  backgroundColor: isLocked ? '#16a34a' : '#ea580c', // Change color based on lock status
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)',
                  '&:hover': {
                    backgroundColor: isLocked ? '#15803d' : '#c2410c',
                  }
                }}
              >
                {isLocked ? 'Unban User' : 'Ban User'}
              </Button> */}
            </Grid>
          </Grid>
        </Grid>

        {/* Subordinates Cards */}
        <Grid item xs={12} md={6}>
          <SubordinateCard
            title="Direct Subordinates"
            icon={<GroupIcon />}
            stats={{
              registrations: userData.directSubordinates.totalRegistrations,
              deposits: userData.directSubordinates.totalNumberOfDeposits,
              amount: userData.directSubordinates.totalDepositAmount
            }}
            gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <SubordinateCard
            title="Team Subordinates"
            icon={<TrendingUpIcon />}
            stats={{
              registrations: userData.teamSubordinates.totalRegistrations,
              deposits: userData.teamSubordinates.totalNumberOfDeposits,
              amount: userData.teamSubordinates.totalDepositAmount
            }}
            gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
          />
        </Grid>



        <Grid item xs={12}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            background: 'linear-gradient(to bottom, #1e293b, rgba(99, 102, 241, 0.05))',
          }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  color: '#f8fafc',
                  mb: 3
                }}
              >
                Bank Account Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Account Name
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Account Number
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        IFSC Code
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Bank Name
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Status
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userData.bankAccounts.map((account, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.08)'
                          }
                        }}
                      >
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          {account.accountName}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          {account.accountNumber}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          {account.ifscCode}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          {account.bankName}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          <Box
                            sx={{
                              px: 2,
                              py: 0.5,
                              borderRadius: 1,
                              display: 'inline-block',
                              backgroundColor: account.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: account.status === 'Active' ? '#10b981' : '#ef4444',
                              fontWeight: 500
                            }}
                          >
                            {account.status}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          <IconButton
                            onClick={() => {
                              setEditBankAccount(account)
                              setBankModalOpen(true)
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            background: 'linear-gradient(to bottom, #1e293b, rgba(99, 102, 241, 0.05))',
          }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  color: '#f8fafc',
                  mb: 3
                }}
              >
                Commission Details
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Level
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Deposit Commission
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Bet Commission
                      </TableCell>
                      <TableCell sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#f8fafc'
                      }}>
                        Total Commission
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userData.commissionDetails.map((commission) => (
                      <TableRow
                        key={commission.level}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.08)'
                          }
                        }}
                      >
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          {commission.level}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          pkr {commission.depositCommission}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          pkr {commission.betCommission}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Inter, sans-serif', color: '#f8fafc' }}>
                          pkr {commission.totalCommission}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <TransactionHistory userId={id} />
        </Grid>

        <Grid item xs={12}>
          <BettingHistory userId={id} />
        </Grid>

        <Grid item xs={12}>
          <BonusHistory userId={id} />
        </Grid>
      </Grid>

      {/* Confirmation Modal */}
      <Dialog
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.12)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: 'Inter, sans-serif', 
          fontWeight: 600,
          color: '#f8fafc',
          backgroundColor: '#1e293b'
        }}>
          {isLocked ? 'Unban User' : 'Ban User'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e293b' }}>
          <Typography sx={{ 
            fontFamily: 'Inter, sans-serif',
            color: '#94a3b8'
          }}>
            Are you sure you want to {isLocked ? 'unban' : 'ban'} this user?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e293b' }}>
          <Button
            onClick={() => setConfirmModalOpen(false)}
            sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 600,
              color: '#94a3b8',
              '&:hover': {
                backgroundColor: 'rgba(148, 163, 184, 0.1)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBanUnban}
            variant="contained"
            sx={{ 
              fontFamily: 'Inter, sans-serif', 
              fontWeight: 600,
              backgroundColor: '#6366f1',
              '&:hover': {
                backgroundColor: '#4f46e5'
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>


      {/* Modals */}
      <BankDetailsModal
        open={bankModalOpen}
        onClose={() => {
          setBankModalOpen(false)
          setEditBankAccount(null)
        }}
        userId={id}
        fetchUserDetails={fetchUserDetails}
        bankAccount={editBankAccount}
      />
      <WalletUpdateModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        userId={id}
        fetchUserDetails={fetchUserDetails}
      />
      </Box>
    </ThemeProvider>
  )
}

export default UserDetails