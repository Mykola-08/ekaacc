// Simple validation script for integration logic
// Run with: node apps/api/scripts/validate-logic.js

console.log("Validating Integration Logic Patterns...");

// Auth0 Logic Check
const auth0Valid = (url, key) => {
    try {
        const u = new URL(url);
        return (u.hostname.endsWith('.auth0.com') || u.hostname.endsWith('.eu.auth0.com')) && key.length >= 16;
    } catch { return false; }
};
console.log("Auth0 Check (valid):", auth0Valid('https://test.auth0.com', '1234567890123456'));
console.log("Auth0 Check (invalid domain):", auth0Valid('https://google.com', '1234567890123456'));
console.log("Auth0 Check (invalid key):", auth0Valid('https://test.auth0.com', 'short'));

// Stripe Logic Check
const stripeValid = (key, secret) => {
    return (key.startsWith('sk_test_') || key.startsWith('sk_live_')) && secret.startsWith('whsec_');
};
console.log("Stripe Check (valid):", stripeValid('sk_test_123', 'whsec_123'));
console.log("Stripe Check (invalid key):", stripeValid('pk_test_123', 'whsec_123'));
console.log("Stripe Check (invalid secret):", stripeValid('sk_test_123', 'sec_123'));

// Resend Logic Check
const resendValid = (key) => key.startsWith('re_') && key.length > 10;
console.log("Resend Check (valid):", resendValid('re_1234567890'));
console.log("Resend Check (invalid):", resendValid('api_1234567890'));

// Supabase Logic Check
const supabaseValid = (url, key) => {
    try {
        const u = new URL(url);
        const parts = key.split('.');
        return u.protocol === 'https:' && parts.length === 3;
    } catch { return false; }
};
console.log("Supabase Check (valid):", supabaseValid('https://xyz.supabase.co', 'header.payload.signature'));
console.log("Supabase Check (invalid url):", supabaseValid('http://xyz.supabase.co', 'header.payload.signature'));
console.log("Supabase Check (invalid key):", supabaseValid('https://xyz.supabase.co', 'not-a-jwt'));
