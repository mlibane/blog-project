const axios = require('axios');
const qs = require('querystring');

// Replace these with your actual values
const clientId = '4253ca63f3ed48e693177181d8d8ae1c';
const clientSecret = '8c801eddf3cb4d51882259f8ce369896';
const authCode = 'AQDnbNllyG8xcDvWcZbCquI4_cAjVpJGCz-wjV8EUin0pNMX05EYfKIo3lAudxBOsgiJX-NTrUnebv-Wi9O8Kwn0xGnw3JSZ6XCoSXXGPrS3Z7EP0jv8i7a9jIiQeJg4Qngx_nUfaXkszS8TPAnUNqn_Wc3u6EyjGxwIMp1Ivi6D3BRkXsOfz0fWShNmogF0KF2yYMxTbEaQ088vfEOwg4UPaMyaFwp4M55Ks1sIZ1SPAUTQlqef-5h6kHf3VUtjOjWF2EdWBUOF91FX_yv0Dq1Q-JDcAxhkqVxDlgE9Pai4WUSB_0D4E8qFS_iOUY6WhYUFoWzgBWNWC64YiDxxhXy2hC9SveyK9iGv6kI';
const redirectUri = 'http://localhost:3000/callback';

// Base64 encode the client ID and client secret
const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

async function getTokens() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri,
    }), {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('Access Token:', response.data.access_token);
    console.log('Refresh Token:', response.data.refresh_token);
  } catch (error) {
    console.error('Error fetching tokens:', error.response ? error.response.data : error.message);
  }
}

getTokens();
