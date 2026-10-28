const YOUTUBE_CONFIG={
  channelUrl:'https://www.youtube.com/@BulagaCityFullGospel',
  channelHandle:'@BulagaCityFullGospel',
  channelId:'',
  apiKey:''
};

async function getUploadsPlaylistId(){
  const params=new URLSearchParams({part:'contentDetails',key:YOUTUBE_CONFIG.apiKey});
  if(YOUTUBE_CONFIG.channelId)params.set('id',YOUTUBE_CONFIG.channelId);
  else if(YOUTUBE_CONFIG.channelHandle)params.set('forHandle',YOUTUBE_CONFIG.channelHandle);
  else throw new Error('Set the church YouTube channel ID or handle in js/youtube.js.');

  const response=await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`);
  const data=await response.json();
  if(!response.ok)throw new Error(data.error?.message||`YouTube channel request failed (${response.status}).`);
  const playlistId=data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if(!playlistId)throw new Error('The configured YouTube channel was not found or has no public uploads.');
  return playlistId;
}

async function getLatestVideos(limit=12){
  if(!YOUTUBE_CONFIG.apiKey)throw new Error('Add a YouTube Data API key to js/youtube.js to load recent sermons.');
  const playlistId=await getUploadsPlaylistId();
  const params=new URLSearchParams({part:'snippet,contentDetails',playlistId,maxResults:String(limit),key:YOUTUBE_CONFIG.apiKey});
  const response=await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${params}`);
  const data=await response.json();
  if(!response.ok)throw new Error(data.error?.message||`YouTube videos request failed (${response.status}).`);
  return (data.items||[]).flatMap(item=>{
    const id=item.contentDetails?.videoId;
    if(!id)return [];
    const thumbnails=item.snippet?.thumbnails||{};
    const thumbnail=['maxres','standard','high','medium','default'].map(size=>thumbnails[size]?.url).find(Boolean)||`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    return [{
      id,
      title:item.snippet?.title||'Untitled video',
      publishedAt:item.contentDetails?.videoPublishedAt||item.snippet?.publishedAt||'',
      thumbnail
    }];
  });
}

async function getSermons(limit=12){
  return getLatestVideos(limit);
}

async function getLiveStream(){return null}

function openChurchYouTube(){
  window.open(YOUTUBE_CONFIG.channelUrl,'_blank','noopener');
}

function openVideoModal(video){
  const modal=document.getElementById('video-modal');
  const iframe=modal?.querySelector('.modal-video');
  if(!modal||!iframe)return;
  const title=modal.querySelector('[data-modal-title]');
  if(title)title.textContent=video.title;
  iframe.title=video.title;
  iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0`;
  modal.setAttribute('aria-hidden','false');
}

document.addEventListener('click',event=>{
  const closeButton=event.target.closest('[data-close-modal]');
  if(closeButton){
    const modal=closeButton.closest('.modal');
    modal?.setAttribute('aria-hidden','true');
    const iframe=modal?.querySelector('.modal-video');
    if(iframe)iframe.src='';
    return;
  }
  const button=event.target.closest('[data-video-id]');
  if(!button)return;
  openVideoModal({id:button.dataset.videoId,title:button.dataset.videoTitle||'Sermon video'});
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    document.querySelectorAll('.modal[aria-hidden="false"]').forEach(modal=>{
      modal.setAttribute('aria-hidden','true');
      const iframe=modal.querySelector('.modal-video');
      if(iframe)iframe.src='';
    });
  }
});
