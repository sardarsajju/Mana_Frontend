// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  return !!token; // returns true/false
};

// Get logged-in user's role
export const getUserRole = () => {
  return localStorage.getItem("role"); // "tester" or "developer"
};

// Get logged-in user ID
export const getUserId = () => {
  return localStorage.getItem("userId");
};

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  window.location.href = "/"; // navigate to login
};
