export function requireAuth(redirectToLogin = true) {
  const token = localStorage.getItem("token");
  
  if (!token && redirectToLogin) {
    console.log("No se encontro el token, redirigiendo a login");
    window.location.href = "/src/login/login.html";
    return false;
  }
  
  return token ? true : false;
}

export function isAuthenticated() {
  return localStorage.getItem("token") ? true : false;
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/src/login/login.html";
}
