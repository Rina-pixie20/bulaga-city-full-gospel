# Bulaga City Full Gospel Church — Static Website

A cinematic multi-page church website built only with HTML5, CSS3 and vanilla JavaScript.

## Run
Open `index.html` directly in a browser, or serve the folder with any simple static web server.

## YouTube setup
Open `js/main.js` and replace:
- `YOUR_CHANNEL_ID`
- `YOUR_YOUTUBE_API_KEY`

The API key should be restricted in Google Cloud Console to the YouTube Data API and the domains where the site is hosted. Do not commit unrestricted secrets.

The site uses:
- `getLiveStream()`
- `getLatestVideos()`
- `renderVideo()`
- `openVideoModal()`

If credentials are absent, the UI deliberately shows a fallback rather than fake church videos.

## Replace imagery
The demo uses remote Unsplash image URLs. For production, replace them with optimized local images in `/images/` and update the URLs in the HTML/JS.

## Important content note
Only church information supplied in the design brief is included. Leadership names, phone numbers and additional service details are left as placeholders/omissions rather than invented.

## Admin
- `admin.html` added with a front-end administration dashboard for church contacts, ministries and weekly programs.
- Prototype access code: `bulaga-admin`. This is intentionally not presented as secure authentication; connect a real backend/auth system before production use.
- Official YouTube: https://www.youtube.com/@BulagaCityFullGospel
- Phones: 0752 811 219 / 0771 874 555
- Church pin: https://maps.app.goo.gl/593VzdaVCTsvVvNJ6?g_st=ac
- No TYTC Youths YouTube channel is included.
