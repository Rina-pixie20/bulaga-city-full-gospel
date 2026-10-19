// Official Bulaga City Full Gospel Church YouTube channel.
const YOUTUBE_CONFIG={
  channelUrl:'https://www.youtube.com/@BulagaCityFullGospel',
  channelHandle:'@BulagaCityFullGospel',
  channelId:'',
  apiKey:''
};
async function getLiveStream(){return null}
async function getLatestVideos(){return []}
async function getSermons(){return []}
function openChurchYouTube(){window.open(YOUTUBE_CONFIG.channelUrl,'_blank','noopener')}
