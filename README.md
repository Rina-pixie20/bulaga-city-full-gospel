# Bulaga City Full Gospel Church — Static Website

A cinematic multi-page church website built only with HTML5, CSS3 and vanilla JavaScript.

## Run
Serve the folder with any simple static web server. Opening `index.html` directly as a `file://` URL may prevent YouTube embeds from loading because the browser cannot send YouTube a website referrer.

## YouTube setup
The homepage and sermons page display the newest public uploads from the channel's uploads playlist when the YouTube API is configured. Without an API key, they show the selected public videos listed in `MANUAL_SERMONS` in `js/youtube.js`. The sermons page also links directly to the channel's complete video archive.

1. In Google Cloud Console, create a project and enable **YouTube Data API v3**.
2. Create an API key, then restrict it to the YouTube Data API and the website's HTTP referrers/domains.
3. Put that key in `YOUTUBE_CONFIG.apiKey` in `js/youtube.js`. The church channel handle is already configured; set `channelId` there only if you prefer to use the channel ID instead. To feature a video manually without the API, update the `MANUAL_SERMONS` entries with each video's ID and title, and optionally its date and thumbnail.
4. Serve the site over HTTP/HTTPS (for example, with a local static web server while developing). A `file://` URL may prevent both API requests and YouTube embeds from working.

The API key is visible to site visitors in a static website, so use referrer restrictions and API quotas; do not use an unrestricted key. Recent uploads refresh when a visitor opens the page when the API is configured. The manually featured videos are embedded from YouTube when played. Browse the full public video archive at https://www.youtube.com/@BulagaCityFullGospelChurch/videos.

## Replace imagery
The demo uses remote Unsplash image URLs. For production, replace them with optimized local images in `/images/` and update the URLs in the HTML/JS.

## Important content note
Only church information supplied in the design brief is included. Leadership names, phone numbers and additional service details are left as placeholders/omissions rather than invented.

## Admin
- `admin.html` added with a front-end administration dashboard for church contacts, ministries and weekly programs.
- Prototype access code: `bulaga-admin`. This is intentionally not presented as secure authentication; connect a real backend/auth system before production use.
- Official YouTube: https://www.youtube.com/@BulagaCityFullGospelChurch
- Phones: 0752 811 219 / 0771 874 555
- Church pin: https://maps.app.goo.gl/593VzdaVCTsvVvNJ6?g_st=ac
- No TYTC Youths YouTube channel is included.
