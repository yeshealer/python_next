import React from 'react'
import { ToastContainer } from 'react-toastify';
import BackgroundEffect from './BackgroundEffect'
import MainSection from './MainSection'

const HomeComponents = () => {
    return (
        <div className={`w-screen h-screen flex items-center bg-gradient-to-b from-transparent via-cyan-200 to-white font-poppinsRegular`}>
            <div className='w-full h-full flex flex-col justify-center items-center gap-10 justify-center overflow-hidden px-3 md:px-0'>
                <div className={`text-center text-3xl sm:text-5xl animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent font-rubikVinyl`}>Binance Address Explore</div>
                <div className="relative w-full md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex items-center justify-center">
                    <BackgroundEffect />
                    <MainSection />
                </div>
            </div>
            <ToastContainer
                theme='colored'
                autoClose={3000}
            />
        </div>
    )
}

export default HomeComponents