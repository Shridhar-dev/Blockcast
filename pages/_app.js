import 'tailwindcss/tailwind.css'
import '../public/global.css'
import Link from 'next/link'
import { createContext, useEffect, useState } from 'react'
import Web3Modal from "web3modal"
import { ethers } from "ethers"
import { podcastAddress } from '../address.config'

import Podcasts from '../contractAbi/Podcasts.json'


let Config = createContext();

function MyApp({ Component, pageProps }) {
  const [signer, setSigner] = useState();
  const [signerAdd, setSignerAdd] = useState();
  const [podcastContract, setPodcastContract] = useState();
  const [navBar, setNavBar] = useState('hidden')
  
  
  useEffect(async() => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      connectWallet()
    }
    else{
      console.log("wallet not connected")
    }
  }, [])


  async function connectWallet(){
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    setSigner(signer);
    const signerAdd = await signer.getAddress();
    setSignerAdd(signerAdd);
    const podcastContract = new ethers.Contract(podcastAddress, Podcasts.abi, signer)
    setPodcastContract(podcastContract);

    
  }
  
  

  return (
    <>
      <nav className=" flex justify-between items-center py-5 px-8 bg-primary text-white">
        <div>
            <Link href="/">
              <a className=" font-semibold">
                BlockCast
              </a>
            </Link>
        </div>
        <div>
            <button className="border ml-auto mr-5 rounded py-3 px-5 visible md:hidden" onClick={()=>{navBar === "hidden" ? setNavBar("flex") : setNavBar("hidden") }} >
              =
            </button>
        
            <div className={`flex-1 w-full ${navBar}  flex-col items-center md:flex-row absolute md:static md:flex left-0 z-10 bg-primary`} >
                <Link href="/explore">
                  <a className="mx-5 py-2 md:py-0">
                    Explore
                  </a>
                </Link>
                {signerAdd ?
                <Link href="/dashboard">
                  <a className=" mx-5 md:ml-5 py-2 md:py-0">
                    Dashboard
                  </a>
                </Link>
                :
                <button onClick={connectWallet} className="bg-white hover:bg-transparent hover:text-white transition-all duration-300 border border-white  text-black py-2 px-3  ">
                  Connect Wallet
                </button>
                }

            </div>
          </div>
      </nav>
      <Config.Provider
        value={{
          signer:signer,
          signerAdd:signerAdd,
          podcastContract:podcastContract,
          connectWallet:connectWallet
        }}
      >
        <Component {...pageProps} />
      </Config.Provider>
    </>
  )
}

export default MyApp
export { Config }
