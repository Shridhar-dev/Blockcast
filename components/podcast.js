import React, { useEffect,useContext, useState } from 'react'
import { useRef } from 'react';
import { AudioHandler } from '../pages/dashboard';
import { Config } from '../pages/_app';
import { create as ipfsHttpClient } from 'ipfs-http-client'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function Podcast(props) {
    const reference = useRef();
    const context = useContext(AudioHandler)
    const context2 = useContext(Config)

    const [playPause, setPlayPause] = useState("/playBtn.svg")
    const [intervalID, setIntervalID] = useState()
    const [nft, setNft] = useState(true)

    let d = new Date(props.data.timestamp*1000);



    useEffect(() => {
        if(reference.current.duration === reference.current.currentTime){
            context.setAudioData({
                duration:0,
                currentTime:0
            })
            setPlayPause("/playBtn.svg")
            clearInterval(intervalID)
            console.log("Song ended")
        }
        
    }, [reference.current?.currentTime])

    useEffect(() => {
        if(context.playingState !== props.k){
            reference.current.currentTime = 0;
            setPlayPause("/playBtn.svg")
            clearInterval(intervalID)
        }
        
    }, [context.playingState])

    useEffect(async() => {
        if(await context2.podcastContract.podcastToNFT(props.data.id) === true){
            setNft(false);
        }
        else{
            setNft(true);
        }

    },[])

    
    context2?.podcastContract?.on('NFTMade', ()=>{
        setNft(false);
    });

    function playAudio() {
        

        if(reference.current.paused){
            reference.current.play()
            context.setPlayingState(props.k)
            setPlayPause("/pauseBtn.svg")
            setIntervalID(setInterval(playData, 1000))
            
        }

        else{
            reference.current.pause()
            context.setPlayingState(0)
            setPlayPause("/playBtn.svg")
            clearInterval(intervalID)
        }
        
    }

    function playData(){
        context.setAudioData({
            duration:parseInt(reference.current?.duration),
            currentTime:parseInt(reference.current?.currentTime),
            title:props.data.name,
            
        })
        
    }

    async function nftSize(){
        let obj = {
            name: props.data.name,
            description: `${props.data.name} is a podcast deployed on the blockchain through Blockcast.`,
            image: `https://api.apitemplate.io/2d777b2b12d20ddc@WgsRBcxs/image.png?text_1.text=Blockcast%23${props.data.id}`,
            animation_url:props.data.link
        }
        
        let jsn = JSON.stringify(obj)

        const addedAudio = await client.add(jsn)
        const url = `https://ipfs.infura.io/ipfs/${addedAudio.path}`
       
        
        context2.podcastContract.makeNFT(url,props.data.id)
    }
    return (
        <div className="flex p-5 flex-col lg:flex-row items-center justify-between border border-gray-300 transition-all duration-200 mt-5 rounded-md w-2/5 hover:shadow-xl">
            <audio className="audio-element" ref={reference}>
                <source src={props.data.link}></source>
            </audio>
            <div className="px-5 " onClick={playAudio}>
                <img src={playPause} className="img-fluid" width="30" />
            </div>
            
            <div className="px-5 my-3 lg:my-0">
                {props.data.name}
            </div>
            {
                nft ?              
                <button onClick={nftSize} className="px-5">
                    🌈
                </button>
                :
                <></>
            }
            <div className="px-5">
                {d.toLocaleDateString("en-US")}
            </div>
        </div>
    )
}

export default Podcast
