const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// Function to exchange code for tokens
async function exchangeCodeForTokens(code) {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.FITBIT_CALLBACK_URL);

    const auth = Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64');

    try {
        const response = await axios.post('https://api.fitbit.com/oauth2/token', params, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error exchanging code for tokens:');
        console.error('Status:', error.response ? error.response.status : 'Unknown');
        console.error('Data:', error.response ? error.response.data : 'No response data');
        console.error('Headers:', error.response ? error.response.headers : 'No headers');
        throw error;
    }
}

// Initiate Fitbit connection
router.get('/connect-fitbit', isAuthenticated, (req, res) => {
    console.log('Initiating Fitbit connection for user:', req.userId);
    const state = req.userId;
    const scopes = 'activity heartrate location nutrition profile settings sleep social weight';
    const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.FITBIT_CALLBACK_URL)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
    res.redirect(authUrl);
});

// Fitbit callback
router.get('/fitbit/callback', async (req, res) => {
    const { code, state, error } = req.query;

    console.log('Received callback with:');
    console.log('Code:', code);
    console.log('State:', state);
    console.log('Error:', error);

    if (error) {
        console.error('Error in Fitbit callback:', error);
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard?fitbit_connection=failed&error=${encodeURIComponent(error)}`);
    }

    try {
        if (!code) {
            throw new Error('No authorization code received from Fitbit');
        }

        const tokens = await exchangeCodeForTokens(code);
        console.log('Received tokens:', tokens);

        const userId = state;

        if (!userId) {
            throw new Error('No user ID found in state parameter');
        }

        await User.findByIdAndUpdate(userId, {
            fitbitAccessToken: tokens.access_token,
            fitbitRefreshToken: tokens.refresh_token,
            fitbitUserId: tokens.user_id
        });

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?fitbit_connection=success`);
    } catch (error) {
        console.error('Error in Fitbit callback:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?fitbit_connection=failed&error=${encodeURIComponent(error.message)}`);
    }
});

// Check Fitbit connection status
router.get('/fitbit-status', isAuthenticated, async (req, res) => {
    try {
        console.log('Checking Fitbit status for user:', req.userId);
        const user = await User.findById(req.userId);
        if (user) {
            const isConnected = !!user.fitbitAccessToken;
            console.log('User Fitbit connection status:', isConnected);
            res.json({ isConnected });
        } else {
            console.log('User not found with ID:', req.userId);
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error checking Fitbit status:', error);
        res.status(500).json({ message: 'Error checking Fitbit status', error: error.message });
    }
});

// Fetch Fitbit data
router.get('/fitbit-data', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user.fitbitAccessToken) {
            return res.status(400).json({ message: 'Fitbit not connected' });
        }

        const response = await axios.get('https://api.fitbit.com/1/user/-/activities/steps/date/today/7d.json', {
            headers: {
                Authorization: `Bearer ${user.fitbitAccessToken}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Fitbit data:', error);
        res.status(500).json({ message: 'Error fetching Fitbit data' });
    }
});

module.exports = router;