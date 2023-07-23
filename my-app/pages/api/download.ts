import { NextApiRequest, NextApiResponse } from 'next';
import ytdl from 'ytdl-core';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const formatId = req.query.id;
  const videoUrl = req.query.url;

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = info.formats.find((_, index) => index.toString() === formatId);

    if (format) {
      const videoTitle = info.videoDetails.title.replace(/[\\/:"*?<>|]/g, '_');
      const videoReadableStream = ytdl(videoUrl, {
        quality: format.itag,
      });

      res.setHeader('Content-Disposition', `attachment; filename="${videoTitle}.${format.container}"`);
      videoReadableStream.pipe(res);
    } else {
      res.status(404).send('No format found with the specified ID.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error downloading video');
  }
}
