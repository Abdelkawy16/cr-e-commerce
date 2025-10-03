import React from 'react';

interface VideoPlayerProps {
  url: string;
  type?: 'youtube' | 'vimeo' | 'mp4';
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, type = 'youtube', title }) => {
  // Function to convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com')
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('youtu.be/')[1]?.split('?')[0];
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }

    // Return original URL if not a supported platform
    return url;
  };

  if (type === 'mp4') {
    return (
      <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
        <video
          src={url}
          title={title}
          className="absolute inset-0 w-full h-full object-contain p-4"
          controls
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full object-contain p-4"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer; 