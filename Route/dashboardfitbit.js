const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User')

// Function to refresh Fitbit token
async function refreshFitbitToken(userId, refresh_token) {
    try {
        const response = await axios.post('https://api.fitbit.com/oauth2/token', null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token,
                client_id: process.env.FITBIT_CLIENT_ID,
                client_secret: process.env.FITBIT_CLIENT_SECRET
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token: new_refresh_token } = response.data;
        
        // Update tokens in the database
        await User.findByIdAndUpdate(userId, {
            fitbitAccessToken: access_token,
            fitbitRefreshToken: new_refresh_token
        });

        return access_token;
    } catch (error) {
        console.error('Error refreshing Fitbit token:', error);
        throw error;
    }
}

// Route to initiate Fitbit OAuth flow
router.get('/connect-fitbit', (req, res) => {
    const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.FITBIT_CALLBACK_URL)}&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight`;
    res.redirect(authUrl);
});

// Fitbit OAuth callback route
router.get('/fitbit/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const tokenResponse = await axios.post('https://api.fitbit.com/oauth2/token', null, {
            params: {
                code,
                grant_type: 'authorization_code',
                client_id: process.env.FITBIT_CLIENT_ID,
                client_secret: process.env.FITBIT_CLIENT_SECRET,
                redirect_uri: process.env.FITBIT_CALLBACK_URL
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token, user_id } = tokenResponse.data;

        // Store tokens in your database associated with the user
        await User.findByIdAndUpdate(req.userId, {
            fitbitAccessToken: access_token,
            fitbitRefreshToken: refresh_token,
            fitbitUserId: user_id
        });

        res.redirect('/dashboard'); // Redirect to your dashboard page
    } catch (error) {
        console.error('Error in Fitbit callback:', error);
        res.status(500).json({ message: 'Error connecting to Fitbit' });
    }
});

// Route to fetch Fitbit data
router.get('/fitbit-data', async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user.fitbitAccessToken) {
            return res.status(400).json({ message: 'Fitbit not connected' });
        }

        let accessToken = user.fitbitAccessToken;

        try {
            const response = await axios.get('https://api.fitbit.com/1/user/-/activities/steps/date/today/1w.json', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            res.json(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token expired, try to refresh
                accessToken = await refreshFitbitToken(req.userId, user.fitbitRefreshToken);
                const response = await axios.get('https://api.fitbit.com/1/user/-/activities/steps/date/today/1w.json', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                res.json(response.data);
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error fetching Fitbit data:', error);
        res.status(500).json({ message: 'Error fetching Fitbit data' });
    }
});

// Add more dashboard-related routes here

module.exports = router;