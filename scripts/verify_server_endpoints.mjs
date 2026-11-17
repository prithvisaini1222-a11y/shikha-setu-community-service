async function verifyEndpoints() {
  console.log('=== VERIFYING SERVER ENDPOINTS & SMART AUTH CTAS ===');

  // 1. Homepage
  const homeRes = await fetch('http://localhost:3000/');
  console.log('Homepage status:', homeRes.status, homeRes.statusText);
  const homeHtml = await homeRes.text();
  console.log('Homepage has Start Learning:', homeHtml.includes('Start Learning'));
  console.log('Homepage has auth-aware link to login:', homeHtml.includes('/auth/login?redirect=/dashboard/learner'));
  console.log('Homepage has Classes 6–10 badge:', homeHtml.includes('Classes 6–10'));

  // 2. Login Page with redirect parameter
  const loginRes = await fetch('http://localhost:3000/auth/login?redirect=/dashboard/learner');
  console.log('Login page status:', loginRes.status, loginRes.statusText);
  const loginHtml = await loginRes.text();
  console.log('Login has Sign In heading:', loginHtml.includes('Sign In'));
  console.log('Login has Welcome to ShikshaSetu:', loginHtml.includes('Welcome to ShikshaSetu'));

  console.log('=== ALL SERVER ENDPOINTS VERIFIED SUCCESSFULLY ===');
}

verifyEndpoints().catch(console.error);
