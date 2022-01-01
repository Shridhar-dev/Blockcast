import Head from 'next/head'
import Link from 'next/dist/client/link'


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>Blockcast</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen w-full">
            <div className=" h-screen">
              <div className=" py-10 bg-primary  flex items-center px-5 md:px-20 justify-between  text-white" >
                  <div>
                    <div className="text-5xl sm:text-6xl py-10 drop-shadow-lg font-bold">
                      Publish Podcasts <br/>on Blockchain
                    </div>
                    <div className=" text-xl leading-8">
                        Blockcast provides you a seamless way of publishing your podcast <br/> on the blockchain.
                    </div>
                    <Link href="/dashboard">
                      <a>
                        <button className="bg-white hover:bg-transparent hover:text-white transition-all duration-300 border border-white  text-black py-3 px-10 mt-10 mb-10">
                          START TODAY
                        </button>
                      </a>
                    </Link>
                  </div>
                  <div className="hidden md:block">
                      <img src="/mic-dynamic-premium.png" className="img-fluid" width="300" />
                  </div>
              </div>
              <div className=" text-center mt-14 text-primary text-lg px-5">
                With Blockcast, you can publish your podcast on the decentralized web3, and also make it an NFT 🌈
              </div>
            </div>

            
        </div>
    </div>
  )
}