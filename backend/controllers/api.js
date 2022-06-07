const getSubtitles = require('youtube-captions-scraper').getSubtitles;
const keyword_extractor = require("keyword-extractor");
const axios = require('axios')

async function getCCKeywords(videoId) {
  const captions = await getSubtitles({ videoID: videoId });
  caption_string = captions.reduce((sum, cur) => sum + cur['text'] + ' ', '');
  
  const config = {
    auth: {
      username: "apikey",  
      password: process.env.NLP_APIKEY
    },
    headers: {
      'Content-Type': 'application/json'
    },
  }
  
  const response = await axios.post(process.env.NLP_URL, {
    "text": caption_string,
    "features": {
      "keywords": {
        "emotion": true,
        "sentiment": true,
        "limit": 10
      }
    }
  }, config)

  let ccKeywords = [];
  response.data['keywords'].forEach(({text}) => {
    let timestamps = [];
    captions.forEach(caption => {
      if (caption['text'].includes(text)) timestamps.push(caption['start']);
    })
    ccKeywords.push({
      text,
      timestamps,
    })
  })

  return ccKeywords;
}

async function getComments(videoId) {
  
  let nextPageToken = null;
  let allComments = [];
  do {
    const config = {
      headers: {
        'Accept': 'application/json'
      },
      params: {
        key: process.env.YOUTUBE_APIKEY,
        part: 'snippet',
        videoId,
        maxResults: 100,
        pageToken: nextPageToken,
      }
    }
    const response = await axios.get(process.env.YOUTUBE_URL, config);
    nextPageToken = response.data['nextPageToken'];
    commentPage = response.data['items'].map(item => item["snippet"]["topLevelComment"]["snippet"])
    allComments = [...allComments, ...commentPage];
  } while (typeof(nextPageToken) != "undefined");
  
  allComments = allComments.map(comment => ({
    text: comment['textOriginal'],
    likeCount: comment['likeCount'],
    timestamps: comment['textOriginal'].match(/\b[0-5]?[0-9]:[0-5][0-9]\b/g),
  }))

  commentsTimed = allComments.filter(comment => Boolean(comment['timestamps']))
  
  commentsTimed = commentsTimed.map(comment => ({
    ...comment,
    keywords: keyword_extractor.extract(comment.text, {
      language:"english",
      remove_digits: false,
      return_changed_case: false,
      remove_duplicates: true,
      return_chained_words: true
    }),
  }))

  commentsTimed.sort((a, b) => (b.likeCount - a.likeCount))
  return commentsTimed
}

module.exports = { 
  getCCKeywords,
  getComments
}