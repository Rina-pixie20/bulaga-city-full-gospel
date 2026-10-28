const YOUTUBE_CONFIG={
  channelUrl:'https://www.youtube.com/@BulagaCityFullGospelChurch',
  channelHandle:'@BulagaCityFullGospelChurch',
  channelId:'',
  apiKey:''
};

const MANUAL_SERMONS=[
  {
    id:'vPCZGrh1qZw',
    title:'POWER OF A STONE BY MIN. MUSOKE YUSUF (DAY 2) OF WEEK OF PRAYER AND FASTING | 26th OCT 2026',
    publishedAt:'2026-10-26',
    thumbnail:'https://i.ytimg.com/vi/vPCZGrh1qZw/hqdefault.jpg'
  },
  {
    id:'O2wWq9DLNvY',
    title:'1st Sunday Service at Bulaga City Full Gospel Church on 20th September 2026'
  },
  {
    id:'H-svODRIWLg',
    title:'Final Day of Prayer Walk at Bulaga City Full Gospel'
  },
  {
    id:'1ApDt896h7g',
    title:'Day 4 of Prayer Walk (Prayer Session) at Bulaga City Full Gospel Church'
  },
  {
    id:'hA_Fy1AoAFk',
    title:'1st Service Sermon: Response to the Voices by Minister Paul Mwesigwa'
  },
  {
    id:'YnC4rQx0_7Q',
    title:'Month of Prayer and Fasting'
  },
  {
    id:'eo9fagquRfo',
    title:"Children's Sunday Service 2"
  },
  {
    id:'PCoMBgm5xYw',
    title:"Children's Sunday Service"
  },
  {
    id:'J7vzWW99oxQ',
    title:'Home Coming: Oldies Testify to the Lord'
  },
  {
    id:'wvLWRtn80N0',
    title:'Home Coming Sunday Praise and Worship Session - Service Two'
  },
  {
    id:'7HSkCqhXmfQ',
    title:'Home Coming Sunday Praise and Worship Session'
  }
];

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
  if(!YOUTUBE_CONFIG.apiKey)return MANUAL_SERMONS.slice(0,limit);
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
  const watchLink=modal.querySelector('[data-video-link]');
  if(watchLink)watchLink.href=`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
  iframe.title=video.title;
  iframe.referrerPolicy='origin';
  iframe.src=`https://www.youtube.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0&playsinline=1`;
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
