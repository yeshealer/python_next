import React, { useEffect } from 'react'
import { useState } from 'react'
import { Icon } from '@iconify/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { toast } from 'react-toastify';
import axios from 'axios';
import styles from '../styles/Home.module.css'
import DropDown from './DropDown';
import Table from './Table';
import 'react-toastify/dist/ReactToastify.css';

interface TransactionTypes {
    timeStamp: number;
    hash: string;
}

export interface OptionTypes {
    value: string;
    label: string;
}

export interface buySellListTypes {
    value: number;
}

export interface dataListTypes {
    bnbPrice: number;
    firstBuyDate: number;
    tokenPrice: number;
    tokenName: string;
    tokenSymbol: string;
    totalBuyAmount: number;
    totalBuyAmountBNB: number;
    totalBuyAmountUSD: number;
    totalSellAmount: number;
    totalSellAmountBNB: number;
    totalSellAmountUSD: number;
    totalProfitUSD: number;
    buyList: buySellListTypes[];
    sellList: buySellListTypes[];
}

export const updateLocalData = (uploadDatas: dataListTypes[]) => {
    const storeData = uploadDatas.map((uploadData) => {
        return JSON.stringify(uploadData)
    })
    localStorage.setItem('dataList', JSON.stringify(storeData))
}

export const randomColor = (label: string) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const colors = ['#475569', '#dc2626', '#ea580c', '#ca8a04', '#65a30d', '#16a34a', '#0891b2', '#4f46e5', '#9333ea', '#c026d3', '#db2777', '#e11d48']
    const firstLetter = label.charAt(0).toUpperCase()
    const index = letters.indexOf(firstLetter) % 12
    const color = colors[index]
    return color
}

export default function MainSection() {

    const [address, setAddress] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [dataList, setDataList] = useState<dataListTypes[]>([])
    const [filterList, setFilterList] = useState<dataListTypes[]>([])
    const [options, setOptions] = useState<OptionTypes[]>([])

    const emptyAddressWarning = () => toast.warn('Please enter your address!')
    const validAddressWarning = () => toast.warn('Please enter valid address!')
    const clearMessage = () => toast.info('Cleared!')

    useEffect(() => {
        const localData = localStorage.getItem('dataList')
        const optionsData = localStorage.getItem('options')
        if (localData) {
            const parseLocalData = JSON.parse(localData).map((parsedData: string) => {
                return JSON.parse(parsedData)
            })
            setDataList(parseLocalData)
            setFilterList(parseLocalData)
        }
        if (optionsData) {
            const parseOptionData = JSON.parse(optionsData).map((optionData: string) => {
                return optionData
            })
            setOptions(parseOptionData)
        }
    }, [])

    const handleGetBalance = async () => {
        if (!address.match('^0x[a-fA-F0-9]{40}$')) {
            if (address === '') {
                emptyAddressWarning()
            } else {
                validAddressWarning()
            }
        } else {
            setIsSearching(true)
            const parsedData = async () => {
                const tokenList: string[] = [];
                const tokenTxnList: any = [];
                const TxnDetailList: any = [];
                const tokenDetailList: OptionTypes[] = [];
                const txnList = await fetch(`/getTransactionList?address=${address}`, {
                    method: 'GET'
                })
                const response = await txnList.json()
                const txnHashList = response.map((transaction: any) => transaction.hash)
                for (let i = 0; i < txnHashList.length; i++) {
                    try {
                        const txnHash = txnHashList[i]
                        const txn = await fetch(`/getTxnDetails?txnHash=${txnHash}`, {
                            method: 'GET'
                        })
                        const response = await txn.json()
                        if (response.logs.length > 0 && !tokenList.includes(response.logs[0].address)) {
                            tokenList.push(response.logs[0].address)
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                for (let i = 0; i < tokenList.length; i++) {
                    try {
                        const tokenAddress = tokenList[i]
                        const tokenTxns = await fetch(`/getTokenTxnList?tokenAddress=${tokenAddress}&walletAddress=${address}`, {
                            method: 'GET'
                        })
                        const response = await tokenTxns.json()
                        if (response.length > 0) {
                            tokenTxnList.push({ 'tokenAddress': tokenAddress, 'txnList': response })
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
                console.log(tokenTxnList)
                for (let i = 0; i < tokenTxnList.length; i++) {
                    try {
                        const tokenTxn = tokenTxnList[i]
                        const tokenTxnDetail = await axios.post('/getTokenTxnDetails', {
                            tokenTxnList: tokenTxn.txnList,
                            tokenAddress: tokenTxn.tokenAddress,
                            walletAddress: address,
                        })
                        tokenDetailList.push({ 'value': tokenTxnDetail.data[0].tokenSymbol.toLowerCase(), 'label': tokenTxnDetail.data[0].tokenName })
                        TxnDetailList.push(tokenTxnDetail.data[0])
                    } catch (error) {
                        console.log(error)
                    }
                }
                setOptions(tokenDetailList)
                setDataList(TxnDetailList)
                setFilterList(TxnDetailList)
                updateLocalData(TxnDetailList)
                localStorage.setItem('options', JSON.stringify(tokenDetailList))
            }
            await parsedData()
            setIsSearching(false)
        }
    }

    const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value)
    }

    const handleClear = () => {
        setDataList([])
        setFilterList([])
        setOptions([])
        updateLocalData([])
        setAddress('')
        clearMessage()
        localStorage.setItem('options', '')
    }

    const handlePaste = () => {
        navigator.clipboard.readText().then((clipText) => {
            setAddress(clipText)
        })
    }

    return (
        <div className={`${styles.filter_blur} w-full h-[570px] xs:h-[610px] md:h-[650px] rounded-2xl flex flex-col justify-between p-0 xs:p-4 md:p-8`}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="search" pattern='^0x[a-fA-F0-9]{40}$' id="search" value={address} className={`${styles.filter_blur} block w-full p-4 pl-10 text-sm text-gray-900 placeholder:text-sky-500 focus:ring-blue-500 focus:border-blue-500 outline-none`} placeholder="Please enter your address." onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleAddress(event)} autoComplete="off" />
                <div className='absolute bottom-3.5 right-[105px] cursor-pointer' onClick={() => handlePaste()}><Icon icon="mdi-light:content-paste" fontSize={25} className='text-sky-500' /></div>
                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2" onClick={() => handleGetBalance()}>Search</button>
            </div>
            <div className={`${styles.filter_blur} w-full h-[500px] rounded-2xl p-4`}>
                {((filterList.length === 0) && !isSearching) &&
                    <Player
                        autoplay
                        loop
                        src="https://assets10.lottiefiles.com/packages/lf20_3vbOcw.json"
                        style={{ height: '500px', width: '500px' }}
                    />
                }
                {isSearching &&
                    <Player
                        autoplay
                        loop
                        src="https://assets6.lottiefiles.com/packages/lf20_urdso8u9.json"
                        style={{ height: '400px', width: '400px' }}
                    />
                }
                {(!isSearching && !(filterList.length === 0)) &&
                    <div className='flex flex-col h-full'>
                        <div className='w-full flex justify-between items-center'>
                            <div className='text-slate-700'>Address Details</div>
                            <div className="flex items-center gap-4">
                                <div className='flex items-end cursor-pointer' onClick={() => handleClear()}>
                                    <Icon icon="material-symbols:cleaning-bucket-outline" fontSize={20} className="text-rose-600" />
                                    <div className='text-sm text-rose-600'>clear</div>
                                </div>
                                <DropDown options={options} setDataList={setDataList} filterList={filterList} />
                            </div>
                        </div>
                        <div className='mt-4 h-full'>
                            <Table setDataList={setDataList} dataList={dataList} setOptions={setOptions} options={options} />
                        </div>
                    </div>
                }
            </div>
        </div >
    )
}
