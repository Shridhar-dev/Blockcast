import React, { createContext, useContext, useState, useEffect } from 'react'
import PlayingBar from '../components/playingBar'
import Podcast from '../components/podcast'
import { Config } from './_app'
import RecordModal from '../components/recordModal';
import toast, { Toaster } from 'react-hot-toast';
import Head from 'next/head'


let AudioHandler = createContext()



function Dashboard() {
    const [audioData, setAudioData] = useState({currentTime:0,duration:0})
    const [userPodcasts, setUserPodcasts] = useState([])
    const [modalState, setModalState] = useState(true)
    const [playingState, setPlayingState] = useState(0)
    const context = useContext(Config)

   
    useEffect(async() => {
        if(context.podcastContract !== undefined){
            if(userPodcasts === undefined || userPodcasts.length === 0){
                context.podcastContract.getUserPodcasts().then((data)=>{
                    setUserPodcasts(data);
                });
            }
            
        }
    }, [context])



    useEffect(async() => {
        const { ethereum } = window;
    
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        if (accounts.length === 0) {
          connectWalletAlert()
        }
        
    }, [])

    context?.podcastContract?.on('PodcastMade', ()=>{
        context.podcastContract.getUserPodcasts().then((data)=>{
            setUserPodcasts(data);
        });
    });

    function connectWalletAlert(){
        toast.error('Please connect your wallet',{  
            duration: 4000,
            position: 'bottom-center',
        });
    }

    return (
        <AudioHandler.Provider value={{
            audioData:audioData,
            setAudioData:setAudioData,
            setModalState:setModalState,
            modalState:modalState,
            setPlayingState:setPlayingState,
            playingState:playingState
        }} >
        <Head>
            <title>Blockcast | Dashboard</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="min-h-screen w-full">
            <div className="py-10 px-5 flex items-center justify-center flex-col bg-primary text-white">
                <img src={`https://robohash.org/${context.signerAdd}`} className="img-fluid" width="200"/>
                <div className=" text-4xl py-5 break-all">
                    Hello, {context.signerAdd}
                </div>
            </div>
            
            <div className="container mx-auto flex flex-col items-center py-5">
                {
                    userPodcasts.length !== 0 ?
                    
                    userPodcasts.map((data,key)=>{
                        return(
                            <Podcast data={data} k={key} key={key}/>
                        )
                    })
                    :
                    <div className="text-center text-xl mt-5"> 
                        You have no podcasts yet. Create one by clicking the mic button on bottom-right.
                    </div>
                    
                }
            </div>
            <PlayingBar />
            <RecordModal podcastContract={context.podcastContract}/>
            <Toaster />
            
        </div>
        </AudioHandler.Provider>
    )
}

export default Dashboard
export { AudioHandler };
