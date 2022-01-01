import React from 'react'
import MicRecorder from 'mic-recorder-to-mp3';
import toast, { Toaster } from 'react-hot-toast';
import { create as ipfsHttpClient } from 'ipfs-http-client'

const Mp3Recorder = new MicRecorder({ bitRate: 128 });
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')



class RecordModal extends React.Component {



    constructor(props){
        super(props);
        this.state = {
          isRecording: false,
          blobURL: '',
          isBlocked: false,
          playPause:'/record.svg',
          isOpen:false,
          name:"",
          category:"tech",
          file:"",
          data:null,
        };
      }
      
    
      start = () => {
        this.recordingStarted();
        navigator.mediaDevices.getUserMedia({ audio: true },
          () => {
            console.log('Permission Granted');
            this.setState({ isBlocked: false });
          },
          () => {
            console.log('Permission Denied');
            this.setState({ isBlocked: true })
          },
        );

        if (this.state.isBlocked) {
          console.log('Permission Denied');
        } else {

          console.log("started")
          Mp3Recorder
            .start()
            .then(() => {
              this.setState({ isRecording: true, playPause: '/stop.png' });
            }).catch((e) => console.error(e));
        }
      };
    
      stop = () => {
        this.recordingStopped();
        Mp3Recorder
          .stop()
          .getMp3()
          .then(async([buffer, blob]) => {
            this.setState({ isRecording: true, playPause: '/record.svg',data:blob });
            /*const added = await client.add(blob)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            console.log(url)*/
            console.log(blob)
          }).catch((e) => console.log(e));
      };

      

      upload = async() =>{
        this.podcastPublished();
        const addedAudio = await client.add(this.state.data)
        const url = `https://ipfs.infura.io/ipfs/${addedAudio.path}`
        this.props.podcastContract.publishPodcast(url,this.state.name,this.state.category)
        console.log("Published")
        this.setState({ isOpen: false });
      }
      
      captureFile = (e) =>{
        e.preventDefault() ;
        const file = e.target.files[0]
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
          this.setState({ data: Buffer(reader.result)})
        }
      }


    recordingStarted = () => toast('Recording Started',{  
      duration: 4000,
      position: 'bottom-left',
      icon: '🔴',
    });

    recordingStopped = () => toast('Recording Stopped',{  
      duration: 4000,
      position: 'bottom-left',
      icon: '🔴',
    });

    podcastPublished = () => toast('Podcast Published',{  
      duration: 4000,
      position: 'bottom-left',
      type: 'success',
    });
      
    render(){

        return (
            this.state.isOpen ?
            <div  className=" fixed w-full h-screen bg-primary bg-opacity-30 flex items-center justify-center top-0 ">
                
                <div className=" bg-white border-2 border-black px-20 pt-5 pb-10 flex items-center flex-col justify-center">
                    <span onClick={()=>{ this.setState({ isOpen: false }); }} className=" justify-self-end ml-auto font-bold">X</span>
                    <img src={this.state.playPause} onClick={()=>{ this.state.playPause === "/record.svg" ? this.start() : this.stop() }} className="img-fluid" width="80px" height="80px"/>
                    <span>or upload file</span>
                    
                    <input type="file" onChange={this.captureFile} id="audio-file-uploading" className="mx-auto w-4/5 audio-file-uploading"/>
                    {/*<label for="audio-file-uploading" className="audio-file-label">Select file to upload</label>*/}
                    
                    {/*
                    <div className=" text-center bg-black text-white py-3 mt-3">
                      <p className="mb-1">Upload thumbnail</p>
                      <input type="file" onChange={} className="mx-auto w-4/5 audio-file-uploading"/>
                    </div>
                    */}

                    <input type="text" onChange={(e)=>{this.setState({name:e.target.value})}} value={this.state.name} placeholder="name" className="mt-5 p-1 px-3 rounded w-full border-2 border-black"></input>
                   
                    <div className="mt-2 w-full text-center">
                      <label for="categories">Choose a category:</label>
                      <select name="categories" id="categories" className="ml-2 border-2 border-black" onChange={(e)=>{this.setState({category:e.target.value})}}>
                        <option value="tech">Tech</option>
                        <option value="fiction">Fiction</option>
                        <option value="history">History</option>
                        <option value="misc">Misc</option>
                      </select>
                    </div>
                    <button onClick={this.upload} className="mt-2 border-2 w-full border-black py-2 hover:text-white hover:bg-black duration-200">
                      Upload
                    </button>
                </div>
                <Toaster />
            </div>
            
            : 
            <div>
              <button onClick={()=>{this.setState({ isOpen: true }) }} className="fixed right-5 bottom-5 bg-primary rounded-md shadow-md border-black p-3" >
                      🎙
              </button>
              <Toaster />
            </div>
            
        )
    }
}

export default RecordModal
