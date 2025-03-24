export const logout = () => {
    localStorage.removeItem("accessToken"); // remove tokens
    localStorage.removeItem("refreshToken");
    window.location.href = "#/login"; // Redirect to login page
  };