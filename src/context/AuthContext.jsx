import React, { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { domain } from "../utils/Secret";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../pages/loadingPage/LoadingPage";

const AuthContext = createContext();

// Demo Admin Restriction Modal Component
const DemoAdminModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-9a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            🎭 Demo Mode Active
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>
          
          {/* Upgrade Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              🚀 Want Full Access?
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Upgrade to unlock all premium features and remove restrictions!
            </p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">Contact: +91-9876543210</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Got It! 👍
            </button>
            <button
              onClick={() => window.open('tel:+919876543210')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all border border-gray-300"
            >
              📞 Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    return !!(refreshToken && accessToken);
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("admin") === "true";
  });
  
  const [isAgent, setIsAgent] = useState(() => {
    return localStorage.getItem("agent") === "true";
  });

  // Add demo admin state
  const [isDemoAdmin, setIsDemoAdmin] = useState(() => {
    return localStorage.getItem("demoAdmin") === "true";
  });

  // Modal state (keeping for future use if needed)
  const [modalState, setModalState] = useState({
    isOpen: false,
    message: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  
  const [loginMessage, setLoginMessage] = useState(() => {
    return sessionStorage.getItem("loginMessage") || "";
  });

  useEffect(() => {
    if (loginMessage) {
      sessionStorage.setItem("loginMessage", loginMessage);
    } else {
      sessionStorage.removeItem("loginMessage");
    }
  }, [loginMessage]);

  const axiosInstance = axios.create({
    baseURL: domain,
  });

  // Demo Admin Restriction Function with Professional Alert
  const checkDemoAdminRestriction = (action = "access this feature") => {
    if (isDemoAdmin) {
      const professionalMessages = [
        "🔒 DEMO MODE ACTIVE\n\nThis feature is restricted in demo mode.",
        "⚠️ FEATURE LOCKED\n\nUpgrade required to access this functionality.",
        "🎯 PREMIUM FEATURE\n\nThis option is available in full version only.",
        "🚀 UPGRADE REQUIRED\n\nContact us to unlock all admin features.",
        "💎 DEMO LIMITATION\n\nFull access available with premium account.",
        "🔓 ACCESS RESTRICTED\n\nUpgrade to unlock this feature.",
        "⭐ PREMIUM ONLY\n\nThis feature requires full admin access."
      ];
      
      const randomMessage = professionalMessages[Math.floor(Math.random() * professionalMessages.length)];
      
      // Create professional alert with contact info
      if (typeof window !== 'undefined' && window.alert) {
        const alertMessage = `${randomMessage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 CONTACT FOR UPGRADE:
   Phone: +91 7029934287 (IND)
   Email: info@DreamClubsolutions.com

🚀 UPGRADE BENEFITS:
   ✅ Full Admin Access
   ✅ All Features Unlocked
   ✅ Priority Support
   ✅ Advanced Settings

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contact us now to unlock the full potential!`;
        
        window.alert(alertMessage);
      }
      
      return false; // Blocked
    }
    return true; // Allowed
  };

  // Function to handle clicks on disabled menu items with Professional Alert
  const handleDemoAdminClick = (featureName) => {
    if (isDemoAdmin) {
      const alertMessage = `🔒 DEMO MODE RESTRICTION

"${featureName}" is locked in demo mode.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 UPGRADE CONTACT:
   Phone: +91 7029934287 (IND)
   Email: info@DreamClubsolutions.com

💎 UNLOCK FEATURES:
   ✅ ${featureName}
   ✅ All Admin Functions
   ✅ Premium Support
   ✅ Advanced Controls

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to upgrade? Contact us today!`;
      
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(alertMessage);
      }
      return false;
    }
    return true;
  };

  // Close modal function
  const closeModal = () => {
    setModalState({
      isOpen: false,
      message: ""
    });
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      if (window.location.pathname === '/forgot-password' || window.location.pathname === '/customer-telegram' || window.location.pathname === '/tms/change-password') {
        return config;
      }

      // Check for demo admin restrictions on specific endpoints
      const restrictedEndpoints = [
        '/api/admin/upi-setting',
        '/api/admin/withdrawal-setting',
        '/api/admin/system-setting',
        '/api/admin/first-deposit-setting',
        '/api/admin/other-deposit-setting',
        '/api/admin/activity-reward',
        '/api/admin/invitation-bonus',
        '/api/admin/attendance-bonus',
        '/api/admin/lucky-streak-setting',
        '/api/admin/winning-streak-setting',
        '/api/admin/lucky-spin',
        '/api/admin/update-turn-over',
        '/api/admin/create-salary',
        '/api/admin/vip-levels'
      ];

      if (isDemoAdmin && restrictedEndpoints.some(endpoint => config.url?.includes(endpoint))) {
        if (config.method?.toLowerCase() !== 'get') {
          checkDemoAdminRestriction("modify system settings");
          return Promise.reject(new Error('Demo admin access restricted'));
        }
      }

      let accessToken = sessionStorage.getItem("accessToken");
  
      if (!accessToken) {
        try {
          accessToken = await refreshAccessToken();
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        } catch (error) {
          console.error("Error refreshing access token:", error);
          throw error;
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
  
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
  
    try {
      const response = await axios.post(`${domain}/api/user/refresh-token`, {
        refreshToken,
      });
  
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, sessionId } =
        response.data.data.tokens;
  
      sessionStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("sessionId", sessionId);
  
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      throw error;
    }
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      // Check if token expires within 60 seconds (1 minute buffer)
      return expirationDate.getTime() - 60000 < new Date().getTime();
    } catch {
      return true;
    }
  };

  // Get appropriate error message based on error code
  const getErrorMessage = (errorCode, defaultMessage) => {
    const errorMessages = {
      'TOKEN_EXPIRED': 'Your session has expired. Please wait while we refresh...',
      'TOKEN_INVALID': 'Invalid session. Please login again.',
      'TOKEN_REQUIRED': 'Authentication required. Please login.',
      'SESSION_INVALID': 'Your session has ended. Please login again.',
      'SESSION_EXPIRED': 'Your session has expired. Please login again.',
      'SESSION_REPLACED': 'Your account has been logged in from another device.',
      'REFRESH_TOKEN_EXPIRED': 'Your session has expired. Please login again.',
      'REFRESH_TOKEN_INVALID': 'Session invalid. Please login again.',
      'AUTH_ERROR': 'Authentication error. Please try again.',
    };
    return errorMessages[errorCode] || defaultMessage || 'An error occurred. Please try again.';
  };

  const validateSession = async () => {
    try {
      const response = await axiosInstance.get("/api/user/validate-session");
      
      if (!response.data.success) {
        // Only logout if explicitly told session is invalid (forcedLogout flag)
        if (response.data.forcedLogout) {
          setLoginMessage(getErrorMessage(response.data.errorCode, "Your session has ended."));
          await logout(true);
          navigate("/login", { replace: true });
          return false;
        }
        // For other failures, don't logout - just return true to keep user logged in
        console.warn("Session validation returned unsuccessful but no forcedLogout flag");
        return true;
      }
      
      setLoginMessage("");
      return true;
    } catch (error) {
      // ONLY logout if server explicitly says forcedLogout
      if (error.response?.data?.forcedLogout) {
        setLoginMessage(getErrorMessage(error.response?.data?.errorCode, "Your session has ended."));
        await logout(true);
        navigate("/login", { replace: true });
        return false;
      }
      
      // For network errors or other issues, DON'T logout the user
      // This prevents unnecessary logouts due to temporary network issues
      console.error("Session validation error (keeping user logged in):", error);
      return true; // Keep user logged in on network errors
    }
  };

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const errorCode = error.response?.data?.errorCode;
      const forcedLogout = error.response?.data?.forcedLogout;
  
      // CRITICAL: Only force logout when server explicitly says so
      if (forcedLogout) {
        const message = getErrorMessage(errorCode, error.response?.data?.message);
        setLoginMessage(message);
        await logout(true);
        navigate("/login", { replace: true });
        return Promise.reject(error);
      }
      
      // Handle 401 errors - attempt token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // Don't try to refresh if the error indicates invalid/corrupted token
        if (errorCode === 'TOKEN_INVALID' || errorCode === 'REFRESH_TOKEN_INVALID') {
          console.error("Token is invalid, cannot refresh:", errorCode);
          setLoginMessage(getErrorMessage(errorCode));
          await logout(true);
          navigate("/login", { replace: true });
          return Promise.reject(error);
        }
  
        try {
          const newAccessToken = await refreshAccessToken();
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          const refreshErrorCode = refreshError.response?.data?.errorCode;
          const refreshForcedLogout = refreshError.response?.data?.forcedLogout;
          
          // Only logout if refresh explicitly failed with forced logout
          if (refreshForcedLogout || refreshErrorCode === 'SESSION_EXPIRED' || refreshErrorCode === 'SESSION_INVALID') {
            console.error("Token refresh failed - session invalid:", refreshErrorCode);
            setLoginMessage(getErrorMessage(refreshErrorCode, "Session expired. Please login again."));
            await logout(true);
            navigate("/login", { replace: true });
          } else {
            // For network errors during refresh, don't logout immediately
            console.error("Token refresh failed (network issue?):", refreshError);
          }
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );

  const checkAuthStatus = async () => {
    try {
      if (location.pathname === '/forgot-password' || location.pathname === '/customer-telegram' || location.pathname === '/tms/change-password') {
        setIsLoading(false);
        return;
      }
  
      const accessToken = sessionStorage.getItem("accessToken");
      const refreshTokenStored = localStorage.getItem("refreshToken");
      
      // If no tokens at all, user is not logged in
      if (!refreshTokenStored) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // If access token is missing or expired, try to refresh it
      if (!accessToken || isTokenExpired(accessToken)) {
        try {
          console.log("[AUTH] Access token expired/missing, attempting refresh...");
          await refreshAccessToken();
          console.log("[AUTH] Token refreshed successfully");
        } catch (refreshError) {
          // Only logout if refresh explicitly failed due to invalid session
          const errorCode = refreshError.response?.data?.errorCode;
          const forcedLogout = refreshError.response?.data?.forcedLogout;
          
          if (forcedLogout || errorCode === 'SESSION_EXPIRED' || errorCode === 'SESSION_INVALID') {
            console.error("[AUTH] Refresh failed - session invalid:", errorCode);
            setLoginMessage(getErrorMessage(errorCode, "Session expired. Please login again."));
            await logout(true);
            return;
          }
          
          // For network errors, keep user logged in with stale token
          console.warn("[AUTH] Refresh failed (network issue?), keeping user logged in");
        }
      }
  
      // Validate session only if we have valid tokens
      const isValid = await validateSession();
      if (!isValid) {
        return;
      }
  
      setIsAuthenticated(true);
      setIsAdmin(localStorage.getItem("admin") === "true");
      setIsAgent(localStorage.getItem("agent") === "true");
      setIsDemoAdmin(localStorage.getItem("demoAdmin") === "true");
    } catch (error) {
      console.error("Authentication check failed:", error);
      // Don't logout on generic errors - only on explicit session invalidation
      const errorCode = error.response?.data?.errorCode;
      const forcedLogout = error.response?.data?.forcedLogout;
      
      if (forcedLogout) {
        setLoginMessage(getErrorMessage(errorCode));
        await logout(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname !== "/register" && location.pathname !== "/forgot-password" && location.pathname !== "/customer-telegram" && location.pathname !== "/tms/change-password") {
      checkAuthStatus();
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  // Updated login function to handle demo admin
  const login = async (accessToken, refreshToken, sessionId, admin, agent, demoAdmin = false) => {
    setLoginMessage("");
    sessionStorage.removeItem("loginMessage");
    
    sessionStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("sessionId", sessionId);
    setIsAuthenticated(true);

    if (admin && !agent) {
      localStorage.setItem("admin", "true");
      setIsAdmin(true);
    } else {
      localStorage.removeItem("admin");
      setIsAdmin(false);
    }
    
    if (agent) {
      localStorage.setItem("agent", "true");
      setIsAgent(true);
    } else {
      localStorage.removeItem("agent");
      setIsAgent(false);
    }

    // Handle demo admin flag
    if (demoAdmin) {
      localStorage.setItem("demoAdmin", "true");
      setIsDemoAdmin(true);
    } else {
      localStorage.removeItem("demoAdmin");
      setIsDemoAdmin(false);
    }
  };

  const logout = async (silent = false) => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("admin");
      localStorage.removeItem("agent");
      localStorage.removeItem("demoAdmin");
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsAgent(false);
      setIsDemoAdmin(false);
      
      if (!silent) {
        navigate("/login", { replace: true });
      }
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        isAgent,
        isDemoAdmin,
        login,
        logout,
        checkAuthStatus,
        refreshAccessToken,
        axiosInstance,
        loginMessage,
        setLoginMessage,
        validateSession,
        checkDemoAdminRestriction, // Export the restriction function
        handleDemoAdminClick // Export the click handler for disabled menu items
      }}
    >
      {children}
      {/* Demo Admin Modal */}
      <DemoAdminModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        message={modalState.message} 
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);