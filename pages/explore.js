import React, { createContext, useContext, useState, useEffect } from 'react'
import PlayingBarExplore from '../components/playingBarExplore'
import { Config } from './_app'
import PodcastCard from '../components/podcastCard';
import toast, { Toaster } from 'react-hot-toast';
import Head from 'next/head'

let AudioHandler = createContext()



function Explore() {
    const [audioData, setAudioData] = useState({currentTime:0,duration:0})
    const [userPodcasts, setUserPodcasts] = useState([])
    const [modalState, setModalState] = useState(true)
    const [playingState, setPlayingState] = useState(0)
    const [tab, setTab] = useState("all")

    const context = useContext(Config)

    let rem;

    useEffect(async() => {
        
        if(context.podcastContract !== undefined){
            
            if(userPodcasts === undefined || userPodcasts.length === 0){
               
                if(tab === "all"){     
                    context.podcastContract.getAllPodcasts().then((data)=>{
                        setUserPodcasts(data);
                    });
                }
                else if(tab === "history"){
                    context.podcastContract.getHistoryPodcasts().then((data)=>{
                        setUserPodcasts(data);
                    });
                }
                else if(tab === "tech"){
                    context.podcastContract.getTechPodcasts().then((data)=>{
                        setUserPodcasts(data);
                    });
                }
                else if(tab === "fiction"){
                    context.podcastContract.getFictionPodcasts().then((data)=>{
                        setUserPodcasts(data);
                    });
                }
                else{
                    context.podcastContract.getMiscPodcasts().then((data)=>{
                        setUserPodcasts(data);
                    });
                }
    
            }
        }
    }, [context,tab])

    useEffect(async() => {
        const { ethereum } = window;
    
        const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        if (accounts.length === 0) {
          connectWalletAlert()
        }
        
    }, [])

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
            <title>Blockcast | Explore</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>    

        <div className="min-h-screen w-full">
            <div className="flex items-center justify-center flex-col bg-primary text-white px-5 pb-10">
                
                <div className=" text-5xl pt-24 font-bold">
                    Explore
                </div>
                <div className="pt-4 text-xl pb-10 text-center">
                    Browse through various podcasts across many categories
                </div>
                <div className="flex items-center justify-center flex-wrap pb-10">
                    <div onClick={()=>{setUserPodcasts([]);setTab("all");}} className={` cursor-pointer border-2 border-white mb-5 p-1 px-5 rounded-full mx-3 ${tab === "all" ? "bg-secondary font-semibold":""}`}>
                        All
                    </div>
                    <div onClick={()=>{setUserPodcasts([]);setTab("tech")}} className={` cursor-pointer border-2 border-white mb-5 p-1 px-5 rounded-full mx-3 ${tab === "tech" ? "bg-secondary font-semibold":""}`}>
                        Tech
                    </div>
                    <div onClick={()=>{setUserPodcasts([]);setTab("fiction")}} className={` cursor-pointer border-2 border-white mb-5 p-1 px-5 rounded-full mx-3 ${tab === "fiction" ? "bg-secondary font-semibold":""}`}>
                        Fiction
                    </div>
                    <div onClick={()=>{setUserPodcasts([]);setTab("history")}} className={` cursor-pointer border-2 border-white mb-5 p-1 px-5 rounded-full mx-3 ${tab === "history" ? "bg-secondary font-semibold":""}`}>
                        History
                    </div>
                    <div onClick={()=>{setUserPodcasts([]);setTab("misc")}} className={` cursor-pointer border-2 border-white mb-5 p-1 px-5 rounded-full mx-3 ${tab === "misc" ? "bg-secondary font-semibold":""}`}>
                        Misc
                    </div>
                </div>
            </div>
            
            <div>
                {
                    userPodcasts.length === 0 ?
                    <h1 className="text-center w-full mx-auto mt-5">No Podcasts</h1>
                    :
                    <div className="md:mx-auto px-2 md:px-10 max-w-full grid grid-cols-1 md:grid-cols-3 gap-5 mx-10 pb-5">
                        {userPodcasts.map((data,key)=>{
                                return(
                                    <div key={key}>
                                        <PodcastCard data={data} k={key}/>
                                    </div>
                                )
                            })
                        }
                    </div>
                    
                }
            </div>
            <PlayingBarExplore />
            <Toaster />
            
        </div>
        </AudioHandler.Provider>
    )
}

export default Explore
export { AudioHandler };