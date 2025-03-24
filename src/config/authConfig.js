import api from '../api';

// Global variable to store the logout function
let logoutFunction = null;

// Function to set the logout function from from UserContext
export const setLogoutFunction = (logout) => {
  logoutFunction = logout; // Assign the provided logout function to the global variable
};

export const getAuthConfig = async () => {
  // Function to handle token refresh
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      console.log("refreshing",refreshToken)
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await api.post(`/users/refresh`, { refreshToken:refreshToken });
      console.log('token refreshed',response.data)
      const { accessToken} = response.data;

      // Store acces token
      localStorage.setItem("accessToken", accessToken);
      console.log(accessToken)

      return accessToken; // Return the new access token for use
    } catch (error) {
      if (logoutFunction) logoutFunction(); // This will log the user out and redirect them to the login page
      return null; // Return null to indicate failure 
    }
  };

  let token = localStorage.getItem("accessToken");

  if (!token) {
    return null
  }

  // Check if token is expired by decoding the JWT and checking the expiry timestamp
  const isTokenExpired = () => {
    const expiry = JSON.parse(atob(token.split(".")[1])).exp * 1000;
    return Date.now() >= expiry;
  };
  
  // If token is expired, refresh it
  if (isTokenExpired()) {
    try {
      token = await refreshAccessToken(); // Refresh the token if expired
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }
  else{
    console.log("Token is valid")
  }

  // Return the auth config with the (possibly refreshed) token
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};