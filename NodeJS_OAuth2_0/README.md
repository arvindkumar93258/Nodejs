# Google OAuth2.0 Setup & Implementation

This README walks you through:

1. **Creating your OAuth2.0 credentials** (Client ID & Client Secret) in the Google Cloud Console  
2. **Wiring up** the Node.js server (`server.js`) and helper (`utils.js`) to perform the OAuth2.0 “Authorization Code” flow

---

## 1. Generate your Client ID & Client Secret

1. **Open the Google Cloud Console**  
   Go to https://console.cloud.google.com/apis/credentials.

2. **Create or select a project**  
   At the top, click the project selector and choose your project—or create a new one.

3. **Configure the OAuth consent screen**  
   - In the left sidebar, choose **OAuth consent screen**.  
   - Select **External** (if users outside your organization will sign in) or **Internal**.  
   - Fill in **App name**, **User support email**, and **Developer contact email**.  
   - Add the following scopes (under “Add scopes”):  
     - `openid`  
     - `email`  
     - `profile`  
   - Save and continue through “Test users” (you can add yourself here) and finish.

4. **Create OAuth2.0 credentials**  
   - Go to **Credentials** → **+ Create Credentials** → **OAuth client ID**.  
   - Choose **Web application**.  
   - Under **Authorized redirect URIs**, add:
     ```
     http://localhost:4000<REDIRECT_URI>
     ```
     where `<REDIRECT_URI>` matches the path you’ll set in your `.env` (e.g. `/auth/callback`).  
   - Click **Create**.  

5. **Copy your credentials**  
   - **Client ID** (e.g. `1234-abc.apps.googleusercontent.com`)  
   - **Client Secret** (e.g. `XyZ_Secret_Value`)  

6. **Add to your `.env`**  
   ```dotenv
   CLIENT_ID=your-google-client-id
   CLIENT_SECRET=your-google-client-secret
   REDIRECT_URI=/auth/callback
   PORT=4000

## 1. How to run the application

1. **Open the browser and type http://localhost:4000/auth or https://www.<your_domain_name>/authe** and press enter

2. **Create or select a project**  
   then you will be automatically redirected to the Google Auth Provider then you need to give acceptance to the Google auth
3. **You will be able to see your auth data liek 