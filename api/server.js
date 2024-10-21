const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ytGet = require('yt-get');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
  exposedHeaders: ['X-Video-Title'], // Allow this header to be exposed
}));

function sanitizeHeaderValue(value) {
  return value.replace(/[^\x20-\x7E]/g, ''); // Removes non-printable ASCII characters
}

app.post('/download', async (req, res) => {
  const { url } = req.body;

  try {
    const videoTitle = await ytGet.getVideoTitle(url);
    const audioStream = await ytdl(url, {
      filter: format => format.audioBitrate > 0,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });

    const safeFilename = encodeURIComponent(videoTitle) + '.mp3';
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Type', 'audio/mpeg');

    const sanitizedTitle = sanitizeHeaderValue(videoTitle);
    res.setHeader('X-Video-Title', sanitizedTitle);
    console.log(sanitizedTitle);

    audioStream.pipe(res);
    
  } catch (error) {
    console.error('Error downloading video:', error);
    if (error.statusCode === 403) {
      res.status(403).send('Access denied: Unable to download this video.');
    } else {
      res.status(500).send('Failed to download video.');
    }
  }
});

// Start your server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});