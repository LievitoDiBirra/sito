const axios = require('axios');
require('dotenv').config(); // Carica le variabili d'ambiente dal file .env


const apiKey ='AIzaSyDbywmjTd0yE3OiZoZzgFF1xZoX1Wi5_Bs'
async function getChannelInfo(channelName) {
  try {
  
    const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'snippet,statistics',
        forUsername: channelName,
        key: apiKey,
      },
    });

    const channelInfo = channelResponse.data.items[0];
    if (!channelInfo) {
      throw new Error('Canale non trovato');
    }

    return channelInfo;
  } catch (error) {
    throw error;
  }
}

async function getLatestVideos(channelId) {
  try {
    const videosResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: channelId,
        maxResults: 5, // Ottieni gli ultimi 5 video
        order: 'date', // Ordina per data
        key: apiKey,
      },
    });

    const videoItems = videosResponse.data.items;

    const videoData = await Promise.all(videoItems.map(async (videoItem) => {
      const videoId = videoItem.id.videoId;
      const videoDetailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'statistics',
          id: videoId,
          key: apiKey,
        },
      });

      const videoDetails = videoDetailsResponse.data.items[0];
      return {
        videoTitolo: videoItem.snippet.title,
        videoVisualizzazioni: videoDetails.statistics.viewCount,
      };
    }));

    return videoData;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getChannelInfo,
  getLatestVideos,
};
