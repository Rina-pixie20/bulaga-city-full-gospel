function showSermonMessage(container,title,message){
  const card=document.createElement('div');
  card.className='card sermon-message';
  const eyebrow=document.createElement('div');
  eyebrow.className='eyebrow';
  eyebrow.textContent='YouTube sermons';
  const heading=document.createElement('h3');
  heading.textContent=title;
  const description=document.createElement('p');
  description.className='meta';
  description.textContent=message;
  card.append(eyebrow,heading,description);
  container.replaceChildren(card);
}

function createSermonCard(video){
  const card=document.createElement('article');
  card.className='card sermon-card';
  const button=document.createElement('button');
  button.className='sermon-card-button';
  button.type='button';
  button.dataset.videoId=video.id;
  button.dataset.videoTitle=video.title;
  button.setAttribute('aria-label',`Play ${video.title}`);

  const media=document.createElement('div');
  media.className='card-media';
  const image=document.createElement('img');
  image.src=video.thumbnail;
  image.alt='';
  image.loading='lazy';
  media.append(image);

  const body=document.createElement('div');
  body.className='card-body';
  const title=document.createElement('h3');
  title.className='card-title';
  title.textContent=video.title;
  body.append(title);
  if(video.publishedAt){
    const date=document.createElement('p');
    date.className='meta';
    const published=new Date(video.publishedAt);
    date.textContent=Number.isNaN(published.getTime())?'':published.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'});
    body.append(date);
  }

  button.append(media,body);
  card.append(button);
  return card;
}

async function loadSermons(){
  document.querySelectorAll('[data-sermons]').forEach(async container=>{
    showSermonMessage(container,'Loading recent videos…','Fetching the latest uploads from the church YouTube channel.');
    try{
      const videos=await getSermons(container.dataset.sermonLimit?Number(container.dataset.sermonLimit):12);
      if(!videos.length){
        showSermonMessage(container,'No public videos found','Upload a public video to the church YouTube channel and it will appear here.');
        return;
      }
      container.replaceChildren(...videos.map(createSermonCard));
    }catch(error){
      showSermonMessage(container,'YouTube videos could not be loaded',error.message);
    }
  });
}

document.addEventListener('DOMContentLoaded',loadSermons);
