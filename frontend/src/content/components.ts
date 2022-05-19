import { stampToSecond } from "./utils";
import bootstrap from 'bootstrap';

function createFloatCard ({ start, end }) {
  const videoContainer = document.querySelector('.html5-video-container');
  const FLOATCARD_TITLE = 'Write a quick comment on what you see to help people!';
  const FLOATCARD_SEG = `From ${start} to ${end}`;
  const FLOATCARD_BUTTON = 'Go';
  const styles = `
    .float-card {
      position: absolute; 
      z-index: 2; 
      height: 10em; 
      width: 15%; 
      margin-top: 45%; 
      margin-left: 3%; 
      padding-right: 1%; 
      padding-left: 1%; 
      background-color: #E5E5E5; 
      border-radius: 0.5em;
    }
    .float-card>.text {
      color: #000000; 
      margin-left: 8%; 
      margin-top: 10%;
    }
    .float-card>.button {
      font-size: 12px; 
      margin-left: 78%; 
      margin-top: 2%;
    }
  `

  const title = document.createElement('p');
  title.classList.add('text');
  title.append(FLOATCARD_TITLE);

  const seg = document.createElement('p');
  seg.classList.add('text')
  seg.append(FLOATCARD_SEG);

  const jump = document.createElement('button');
  jump.classList.add('button')
  jump.append(FLOATCARD_BUTTON);
  jump.onclick = () => {
    window.scrollTo(0, 1150);
  };

  const floatCard = document.createElement('div');
  floatCard.classList.add('float-card');
  floatCard.append(title, seg, jump);
  videoContainer.appendChild(floatCard);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function deleteFloatCard () {
  console.log('delete')
  const videoContainer = document.querySelector('.html5-video-container');
  const floatCard = videoContainer.querySelector('.float-card');
  floatCard ? videoContainer.removeChild(floatCard) : null;
}

function readComments(commentsTimed, { start, end }) {
  let commentsToRead = commentsTimed.filter(({timestamps}) => {
    Boolean(timestamps.find((timestamp) => (start <= timestamp && timestamp < end)));
  });

  let audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
  audio.play();

  const video = document.getElementsByTagName('video')[0];
  video.pause();

  document.addEventListener('keydown', handleKeyDown)

  let commentIndex = 0
  function handleKeyDown (event) {
    if (event.shiftKey) {
      const msg = new SpeechSynthesisUtterance();
      if (commentIndex == commentsToRead.length) {
        msg.text = 'Those are all the comments!' 
        document.removeEventListener('keydown', handleKeyDown)
        return
      } else {
        msg.text = commentsToRead[commentIndex].text;
        commentIndex += 1
      }
      window.speechSynthesis.speak(msg) 
    }
  }
}

function createEasyStartCard(comments) {
  const video = document.getElementsByTagName('video')[0];
  const STARTCARD_TITLE1 = 'Easy Start';
  const STARTCARD_GUIDES = ['__looks like__', 'The color of __ is __', 'The __ is __'];
  const STARTCARD_TITLE2 = 'See what others are talking about...';

  const styles = `
    .easy-start-card {
      background-color: rgb(229, 229, 229); 
      width: 35%; height: 80%; padding: 1.5%; 
      margin-bottom: 2%; 
      border-radius: 5%;
    }
    .easy-start-card .start-guide {
      margin-top: 3%;
      margin-bottom: 3%;
    }
    .easy-start-card>.comments {
      margin-top: 3%;
      margin-left: 3%;
      margin-right: 3%;
    }
    .easy-start-card .timestamp {
      color: blue;
      text-decoration: underline;
    }
    .easy-start-card span{
      margin-right: 2%
    }
  `

  const title1 = document.createElement('h2');
  title1.classList.add('title');
  title1.append(STARTCARD_TITLE1);

  const guideContainer = document.createElement('div');
  guideContainer.classList.add('start-guide');

  STARTCARD_GUIDES.forEach(text => {
    const guideElement = document.createElement('span');
    guideElement.append(text);
    guideContainer.appendChild(guideElement);
  })

  const title2 = document.createElement('h2');
  title2.classList.add('title');
  title2.append(STARTCARD_TITLE2);
  
  const commentContainer = document.createElement('ul');
  commentContainer.classList.add('comments');

  comments.forEach(comment => {
    const commentElement = document.createElement('li');
    comment.timestamps.forEach(timestamp => {
      const stampElement = document.createElement('span');
      stampElement.classList.add('timestamp');
      stampElement.append(timestamp);
      stampElement.onclick = () => {
        window.scrollTo(0, 0);
        video.currentTime = stampToSecond(timestamp);
        video.play();
      }
      commentElement.appendChild(stampElement);
    })
    commentElement.append(comment.text);
    commentContainer.appendChild(commentElement);
  })

  const addCommentSection = document.querySelector('ytd-comments-header-renderer.style-scope.ytd-item-section-renderer');
  const easyStartCard = document.createElement('div');
  easyStartCard.classList.add('easy-start-card');
  easyStartCard.append(title1, guideContainer, title2, commentContainer);
  addCommentSection.appendChild(easyStartCard);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function createRangeBar(blackRanges) {
  const palette = ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1'];
  const styles = `
    .range-bar {
      background-color: white;
      width: 100%;
      height: 5px;
      margin: auto;
      position: relative;
      z-index: 2;
    }
    .range-bar .seg {
      height: 100%;
      position: absolute;
    }

  `

  const barContainer = document.querySelector('.ytp-progress-bar-container');
  const bar = document.createElement('div');
  bar.classList.add('range-bar')
  const totalTime = blackRanges[blackRanges.length - 1].end;
  let left = 0, width = 0, color = '';

  blackRanges.forEach((blackRange, i) => {
    const {start, end, score} = blackRange;
    width = (end - start) / totalTime * 100;
    color = palette[score == 1 ? 9 : Math.floor(score / 0.1)];

    const seg = document.createElement('div');
    seg.classList.add('seg');
    seg.setAttribute('id', 'seg' + i)
    bar.appendChild(seg);
    seg.style.width = width + '%';
    seg.style.left = left + '%';
    seg.style.backgroundColor = color;
    left += width;
  })
  barContainer.insertAdjacentElement('afterend', bar)

  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function createAccordion(commentsTimed) {
  const accordionItem = document.createElement('div');
  accordionItem.classList.add("accordion-item");

  const accordionHeader = document.createElement('h2');
  accordionHeader.classList.add("accordion-header");
  accordionHeader.setAttribute('id', 'headingOne');

  const accordionButton = document.createElement('button');
  accordionButton.classList.add("accordion-button");
  accordionButton.classList.add("collapsed");
  accordionButton.setAttribute('type', "button");
  accordionButton.setAttribute('data-bs-toggle', "collapse");
  accordionButton.setAttribute('data-bs-target', "#collapseOne");
  accordionButton.setAttribute('aria-expanded', "false");
  accordionButton.setAttribute('aria-controls', "collapseOne");
  accordionButton.append("Accessible Comments");

  accordionHeader.append(accordionButton);

  const accordionCollapse = document.createElement('div');
  accordionCollapse.classList.add("accordion-collapse");
  accordionCollapse.classList.add("collapse");
  accordionCollapse.setAttribute('id', "collapseOne");
  accordionCollapse.setAttribute('aria-labelledby', "headingOne");
  accordionCollapse.setAttribute('data-bs-parent', "#accordionExample");

  const accordionBody = document.createElement('div');
  accordionBody.classList.add("accordion-body");

  // collect all the timestamps
  let allTimestamps = [];
  commentsTimed.forEach(comment => {
    comment.timestamps.forEach(timestamp => {
      if (!allTimestamps.includes(timestamp)) {
        allTimestamps.push(timestamp);
      }
    })
  })

  // sort these timestamps
  allTimestamps.sort(function(a, b) {return stampToSecond(a) - stampToSecond(b)});

  // create the structure
  allTimestamps.forEach(timestamp => {
    const timeHeader = document.createElement('h4');
    timeHeader.append(timestamp);
    const commentList = document.createElement('ul');
    commentList.setAttribute('id', 'timestamp-' + timestamp);
    accordionBody.append(timeHeader, commentList);
  })

  accordionCollapse.append(accordionBody);
  accordionItem.append(accordionHeader, accordionCollapse);

  const accordion = document.createElement('div');
  accordion.classList.add('accordion');
  accordion.setAttribute("id", "accordionExample");
  accordion.append(accordionItem);

  const commentSection = document.querySelector('#comments');
  commentSection.insertAdjacentElement('beforebegin', accordion);

  // add all the comments
  commentsTimed.forEach(comment => {
    comment.timestamps.forEach(timestamp => {
      const accordionComment = document.createElement('li');
      accordionComment.append(comment.text);

      console.log(comment);
      console.log('timestamp-' + timestamp);
      const commentList = document.getElementById('timestamp-' + timestamp);
      commentList.append(accordionComment);
      console.log(commentList);
    })
  })
}

export {
  createFloatCard,
  deleteFloatCard,
  readComments,
  createEasyStartCard,
  createRangeBar,
  createAccordion, 
}