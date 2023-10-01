document.addEventListener('DOMContentLoaded', () => {
  const channelForm = document.getElementById('channelForm');
  const channelInfo = document.getElementById('channelInfo');
  const videoChart = document.getElementById('videoChart').getContext('2d');

  channelForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const channelName = document.getElementById('channelName').value;

    try {
      const response = await fetch(`/canale?channelName=${encodeURIComponent(channelName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Visualizza le informazioni del canale e dei video
      const channelHTML = `
        <h2>Informazioni per il canale "${data.nomeCanale}"</h2>
        <p>Numero Iscritti: ${data.numeroIscritti}</p>
        <p>Numero Visualizzazioni: ${data.numeroVisualizzazioni}</p>
        <p>Video Caricati: ${data.videoCaricati}</p>
        <p>Nazione: ${data.nazione}</p>
        <p>Data Creazione Canale: ${data.dataCreazioneCanale}</p>
      `;

      channelInfo.innerHTML = channelHTML;
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
    
          try {
            // Utilizza la latitudine e la longitudine per ottenere la città dall'API di geocoding
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const locationData = await response.json();
    
            // Estrai la città dalla risposta e visualizzala
            const userCity = locationData.address.city || locationData.address.town || locationData.address.village;
            document.getElementById('userCity').textContent = `Posizione dell'utente: ${userCity}`;
          } catch (error) {
            console.error(error);
            document.getElementById('userCity').textContent = 'Impossibile ottenere la posizione';
          }
        }, (error) => {
          console.error(error);
          document.getElementById('userCity').textContent = 'Impossibile ottenere la posizione';
        });
      } else {
        console.log('Geolocalizzazione non supportata dal browser');
        document.getElementById('userCity').textContent = 'Geolocalizzazione non supportata';
      }
    
      // Estrai i dati dei video per il grafico a barre
      const videoData = data.ultimiVideo;

      const videoTitles = videoData.map((video) => video.videoTitolo);
      const videoViews = videoData.map((video) => parseInt(video.videoVisualizzazioni));

      // Crea il grafico a barre
      new Chart(videoChart, {
        type: 'bar',
        data: {
          labels: videoTitles,
          datasets: [{
            label: 'Visualizzazioni',
            data: videoViews,
            backgroundColor: [
              'rgba(75, 192, 192, 0.5)',
              'rgba(255, 99, 132, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(153, 102, 255, 0.5)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false, // Nascondi la legenda
            },
          },
        },
      });
      

    } catch (error) {
      console.error(error);
      channelInfo.innerHTML = '<p>Errore nella richiesta API di YouTube</p>';
    }
  });
});
