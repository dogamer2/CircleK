// auth.js
(function() {
  // List of pages that require authentication
  const protectedPages = [
    '/circlek.html',
    '/redeem.html',
    '/fullyredeem.html'
  ];

  if (protectedPages.includes(window.location.pathname)) {
    if (!localStorage.getItem('authCodeValid')) {
      // Redirect to login page if not authenticated
      window.location.href = "/login.html";
    }
  }
})();
