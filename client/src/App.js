import './App.css';
import { useState } from 'react';

function App() {
  const [videoUrl, setVideoUrl] = useState(''); 
  const [downloadLink, setDownloadLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioName, setAudioName] = useState('');

  const getVideoUrl = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }), 
      }
    );

      if (!response.ok) {
        throw new Error('Failed to download audio.');
      }

      const title = response.headers.get('X-Video-Title');

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Set download link
      setDownloadLink(url);
      setAudioName(title)
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className='red-back'>
        <h1>YtToMp3</h1>
      </div>
      <div className='form-div'>
      <form onSubmit={getVideoUrl}>
          <input 
            id="videoUrl" 
            type="text" 
            placeholder="YouTube Video URL" 
            value={videoUrl} 
            onChange={(e) => setVideoUrl(e.target.value)} 
            required 
          />
          <button type="submit">{ loading ? "loading" : "Convert" }</button>
          <p>Note: Only YouTube videos are supported.</p>
        </form>
      </div>
      <div className='download-link'>
      {downloadLink && ( 
          <div className='download'>
            <a href={downloadLink} download="audio.mp3">Download {audioName}.Mp3</a>
          </div>
        )}
      </div>
      <div className='text'>
      <div className="explanation">
        <h2>How it works</h2>
        <p>YtToMp3 works by converting the given video URL to an MP3 that the user is able to download.</p>
        <p>step 1:Open up Youtube.com</p>
        <p>step 2:Go to the video you want to download</p>
        <p>step 3:Copy the video link from the address bar or from the share button</p>
        <p>step 4:Paste the copied link into the input field above and click on covert and download your Mp3</p>
      </div>
      </div>
    </div>
  );
}

export default App;