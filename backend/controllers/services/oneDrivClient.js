const msal = require('@azure/msal-node');

const config = {
    auth: {
        clientId: '33160b53-366e-48fd-93d2-f6db7990867a',
        authority: 'https://login.microsoftonline.com/d7f86710-01e1-461d-8599-758de4542e2b',
        clientSecret: 'R5j8Q~4TTMV1uTY8tA1hSvG1P1GLkYR88tIyIcyW',
    }
};

const cca = new msal.ConfidentialClientApplication(config);

async function getAccessToken() {
    const tokenRequest = {
        scopes: ["https://graph.microsoft.com/.default"],
    };

    try {
        const response = await cca.acquireTokenByClientCredential(tokenRequest);
        return response.accessToken;
    } catch (error) {
        console.error("Error getting access token:", error);
        throw error;
    }
}

module.exports = {
    getAccessToken,
};

