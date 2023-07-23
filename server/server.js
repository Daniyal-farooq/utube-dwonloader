const express = require('express')
const app = express()
const ytdl = require('ytdl-core');
const fs = require('fs');
const readline = require('readline');
var cors = require("cors")



app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

var xyz = [{}, {}]
var url = ""
var videotitle = ""
app.get("/", (req, res) => {
    res.send("Server running")
})



async function downloadYouTubeVideo(videoUrl, formatId) {
    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = info.formats.find((_, index) => index.toString() === formatId);

        if (format) {

            const videoTitle = info.videoDetails.title.replace(/[\\/:"*?<>|]/g, '_');
            console.log(`Downloading: ${videoTitle}`);
            console.log(`Selected Format ID: ${formatId}`);
            console.log(`Selected Quality: ${format.qualityLabel || 'Unknown Quality'}`);
            console.log(`Has Audio: ${format.hasAudio}`);

            const videoReadableStream = ytdl(videoUrl, {
                quality: format.itag
            });

            const fileStream = fs.createWriteStream(`${videoTitle}.${format.container}`);

            videoReadableStream.pipe(fileStream);

            videoReadableStream.on('end', () => {
                console.log('Download complete!');
            });
        } else {
            console.log(`No format found with ID ${formatId}.`);
        }
    } catch (error) {
        console.error('Errorrrrrrr:', error.message);
    }
}

async function displayAvailableFormats(videoUrl) {

    try {
        console.log("display format function running : ", videoUrl);
        console.log("Error in ytdl");
        const info = await ytdl.getInfo(videoUrl);
        console.log("Error in ytdl");
        const formats = info.formats.map((format, index) => {
            const quality = format.qualityLabel || 'Unknown Quality';
            const hasAudio = format.hasAudio ? 'Yes' : 'No';
            const videoTitle = info.videoDetails.title.replace(/[\\/:"*?<>|]/g, '_');
            console.log('Video Title:', info.videoDetails.title);
            // Extract the file extension from the mimeType
            const mimeTypeParts = format.mimeType.split('/');
            const fileExtension = mimeTypeParts[mimeTypeParts.length - 1];
            return { formatId: index.toString(), quality, hasAudio, videoTitle ,  fileExtension  };
        });

    
        xyz = formats;
        url = videoUrl;

    } catch (error) {
        console.error('Error:', error.message);
    }
}
app.post("/linker", async (req, res) => {
    try {
        var videoUrl = req.query.url;
        console.log("url recieved by function : ", videoUrl);
        await displayAvailableFormats(videoUrl);
        res.json(xyz);
        // res.send('Video downloaded successfully!');

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Error downloading video');
    }
})
const path = require('path');

// const path = require('path');
// const fs = require('fs');

app.post('/selected', async (req, res) => {
    try {
        console.log('FORMAT ID RECEIVED: ', req.query.id);
        await downloadYouTubeVideo(url, req.query.id);
        videotitle = req.query.title;
        res.json({
            message: "Video downloaded"
        })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error downloading video');
    }
});


app.get("/video", (req, res) => {
    // Downloading big file using good way (Streams)
    const readableStream = fs.createReadStream(`${videotitle}.mp4`);
    // readableStrem -> writableStream
    res.writeHead(200, { 'Content-Type': 'video/mp4' });
    readableStream.pipe(res);

})

app.listen(9000, () => console.log('Server running on port 9000'));