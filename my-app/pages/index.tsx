import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import axios from 'axios';
import { log } from 'console';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [link, setLink] = useState("")
  const [linkChecker , setLinkChecker] = useState(false)
  const [formats, setFormats] = useState<any[]>([])
  const [checker, setChecker] = useState(false)
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("");
  const [downloadButtonChecker , setDownloadButtonChecker ] = useState(false)
  const downloadVideo = async () => {
    try {
      const response = await axios.get('http://localhost:9000/video', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'example.mp4');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  };
  const linkHandler = async () => {
    try {
      setLinkChecker(false)
      console.log(link);
      const serverResponse = await axios.post(`http://localhost:9000/linker?url=${link}`)
      console.log("url sent to server");
      // console.log(serverResponse);
      setChecker(true)
      setFormats(serverResponse.data)
      // setTitle(serverResponse.data.videoTitle)
      console.log(serverResponse.data);
      setLinkChecker(true)
    } catch (error) {
      console.log(error);
    }
  }
  const downloadHandler = async (video) => {
    try {
      setDownloadButtonChecker(false)
      // const serverResponse = await axios.post(`http://localhost:9000/selected?id=${video.formatId}`);
      const serverResponse = await axios.post(`http://localhost:9000/selected?id=${video.formatId}&title=${video.videoTitle}`);


      // const fileUrl = window.URL.createObjectURL(new Blob([serverResponse.data]));
      // const link = document.createElement('a');
      // link.href = fileUrl;
      // link.setAttribute('download', 'xyz.mp4'); // Replace with the desired file name and extension
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      // try {
      //   const response = await axios.get('http://localhost:9000/video', {
      //     responseType: 'blob',
      //   });

      // const videoBlob = new Blob([serverResponse.data], { type: 'video/mp4' });
      // const videoUrl = URL.createObjectURL(videoBlob);


      setVideoUrl(videoUrl);
      setDownloadButtonChecker(true)
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container">
          <div className="row">
            <div className="col-4"></div>
            <div className="col-4">YOUTUBE DOWNLOADER</div>
            <div className="col-4"></div>
          </div>
        </div>
        enter url <input autoComplete="off" type="text" id="url" name="url" onChange={(e) => setLink(e.target.value)} /><Button variant="info" onClick={linkHandler}>Download</Button>{' '}<br />
        {/* {checker ? (
          <>
            <h1>Formats exist</h1><br />
            {formats.map((video: any) => (
              <><hr /> <p key={video.formatId}>Format ID : {video.formatId} <br />Title :  {video.videoTitle}</p>
                <p>{video.quality}</p>
                <p>{video.fileExtension}</p>
                <Button onClick={() => downloadHandler(video)}>Download</Button>
              </>

            ))}
          </>
        ) : (
          <h1>No formats</h1>
        )} */}

      </main>
      {downloadButtonChecker &&    <button onClick={downloadVideo}>Download</button> }
   
      {videoUrl && (
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      )}{linkChecker &&   <div className="overflow-auto" style={{ height: "300px" }}>

{checker ? (
          <>
            <h1>Formats exist</h1><br />
            {formats.map((video: any) => (
              <><hr /> <p key={video.formatId}>Format ID : {video.formatId} <br />Title :  {video.videoTitle}</p>
                <p>{video.quality}</p>
                <p>{video.fileExtension}</p>
                <Button onClick={() => downloadHandler(video)}>Prepare format</Button>
              </>

            ))}
          </>
        ) : (
          <h1>No formats</h1>
        )}
      {/* <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta, cupiditate.</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta, cupiditate.</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta, cupiditate.</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta, cupiditate.</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta, cupiditate.</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta, cupiditate.</p> */}
    </div>}
    
    </>
  )
}