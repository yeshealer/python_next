import React, { Dispatch, SetStateAction } from 'react'
import { Player } from '@lottiefiles/react-lottie-player';
import { Icon } from '@iconify/react';
import { dataListTypes, OptionTypes } from './MainSection'
import DropDownInput from './DropDownInput'
import styles from '../styles/Home.module.css'

interface TableProps {
    setDataList: Dispatch<SetStateAction<dataListTypes[]>>;
    dataList: dataListTypes[];
    options: OptionTypes[];
    setOptions: Dispatch<SetStateAction<OptionTypes[]>>;
}

const Table: React.FC<TableProps> = ({
    setDataList,
    dataList,
    options,
    setOptions
}) => {
    return (
        <div className={`sm:rounded-lg w-full h-full overflow-x-auto overflow-y-visible`}>
            {dataList.length > 0 ? (
                <table className={`${styles.filter_blur} w-full text-left text-gray-700 sm:rounded-lg overflow-x-auto`}>
                    <thead className="text-sm text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="py-3 px-3 min-w-[130px]">
                                TokenName
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[130px]">
                                TokenPrice
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[130px]">
                                Sell Amount
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[180px]">
                                Sell Amount in USD
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[180px]">
                                Sell Amount in BNB
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[130px]">
                                Buy Amount
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[180px]">
                                Buy Amount in USD
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[180px]">
                                Buy Amount in BNB
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[130px]">
                                First Buy Date
                            </th>
                            <th scope="col" className="py-3 px-3 min-w-[130px]">
                                Total Profit
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.map((listData, index) => {
                            return (
                                <tr className="border-b hover:bg-[#ffffff60] text-xs cursor-pointer" key={index}>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>{listData.tokenSymbol}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>{listData.tokenPrice.toFixed(4)}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>{listData.totalSellAmount.toFixed(4)}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>${listData.totalSellAmountUSD.toFixed(4)}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>{listData.totalSellAmountBNB.toFixed(4)}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>{listData.totalBuyAmount.toFixed(4)}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>${listData.totalBuyAmountUSD.toFixed(4)}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>{listData.totalBuyAmountBNB.toFixed(4)}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>{new Date(listData.firstBuyDate * 1000).toDateString()}</td>
                                    <td className='py-3 px-3 text-sky-500 transition-all'>${listData.totalProfitUSD.toFixed(4)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            ) : (
                <div>
                    <Player
                        autoplay
                        loop
                        src="https://assets6.lottiefiles.com/packages/lf20_dmw3t0vg.json"
                        style={{ height: '300px', width: '300px' }}
                    />
                </div>
            )}
        </div>
    )
}

export default Table