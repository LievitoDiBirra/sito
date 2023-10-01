const express = require('express');
const api = require('./api');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'));

app.get('/canale', async (req, res) => {
  const channelName = req.query.channelName;

  if (!channelName) {
    res.status(400).json({ error: 'Devi fornire un nome di canale' });
    return;
  }

  try {
    const channelInfo = await api.getChannelInfo(channelName);
    const videoData = await api.getLatestVideos(channelInfo.id);

    // Creare l'oggetto finale da inviare come risposta
    const channelData = {
      nomeCanale: channelInfo.snippet.title,
      numeroIscritti: channelInfo.statistics.subscriberCount,
      numeroVisualizzazioni: channelInfo.statistics.viewCount,
      videoCaricati: channelInfo.statistics.videoCount,
      nazione: channelInfo.snippet.country,
      dataCreazioneCanale: channelInfo.snippet.publishedAt,
      ultimiVideo: videoData,
    };

    res.json(channelData);
  } catch (error) {
    res.status(500).json({ error: 'Errore nella richiesta API di YouTube (server)' });
  }
});

app.listen(port, () => {
  console.log(`Il server è in ascolto sulla porta ${port}`);
});
