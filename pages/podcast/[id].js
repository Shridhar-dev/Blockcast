import { useRouter } from 'next/dist/client/router'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { Config } from '../_app'
import Head from 'next/head'
import toast, { Toaster } from 'react-hot-toast';

function Id() {
    const reference = useRef();
    const context = useContext(Config)



    const [data, setData] = useState({
        name:"",
        author:"",
        category:"misc",
        timestamp:"",
        id:"",
        link:undefined
    })

    let router = useRouter();
  
    useEffect(() => {
        if(context.podcastContract !== undefined){
            context.podcastContract.getPodcastsFromId(router.query.id).then((data1) => {
                setData(data1)
            })
            
        }
        
    },[context])

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
        <div className="h-screen w-full bg-primary text-white flex">
            <Head>
                <title>Blockcast | Podcast {data?.id.toString()}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>    
                
            <div className="bg-white w-full text-black flex items-center justify-center flex-col">
                <h1 className="text-5xl px-5">{data?.name}</h1>
                <div className="mt-5 px-5">
                    <p className="my-3 text-xl break-all">By: {data?.author}</p>
                    <p className="my-3 text-xl">Category: {data?.category === "" ? "misc" : data?.category}</p>
                    <p className="my-3 text-xl">Published: {(new Date(data?.timestamp*1000)).toLocaleDateString("en-US")}</p>
                    <p className="my-3 text-xl">Id: {data?.id.toString()}</p>
                    
                  
                </div>
                <audio className="audio-element fixed w-full bottom-0 bg-primary" ref={reference} controls>
                {data?.link ?
                    <source src={data?.link}></source> : <></>
                }
                </audio>
            </div>
          
            
            <Toaster />
        </div>
    )
}

export default Id
