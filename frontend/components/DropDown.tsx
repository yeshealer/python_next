import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react';
import { OptionTypes, dataListTypes } from './MainSection'
import styles from '../styles/Home.module.css'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface DropDownProps {
    options: OptionTypes[];
    setDataList: Dispatch<SetStateAction<dataListTypes[]>>;
    filterList: dataListTypes[];
}

const DropDown: React.FC<DropDownProps> = ({
    options,
    setDataList,
    filterList
}) => {
    const [preTitle, setPreTitle] = useState('All')
    const handleFilter = (label: string) => {
        const filterData = filterList.filter((listData) => listData.tokenName === label)
        setDataList(filterData)
        setPreTitle(label)
    }
    const handleListData = () => {
        setDataList(filterList)
        setPreTitle('All')
    }
    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className={`${styles.filter_blur} inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-100`}>
                {preTitle}
                <Icon icon="material-symbols:keyboard-arrow-down-rounded" fontSize={20} />
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-60 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <div
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        `block px-4 py-2 text-sm`
                                    )}
                                    onClick={() => handleListData()}
                                >
                                    All
                                </div>
                            )}
                        </Menu.Item>
                        {options.map((option, index) => {
                            return (
                                <Menu.Item key={index}>
                                    {({ active }) => (
                                        <div
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                `block px-4 py-2 text-sm`
                                            )}
                                            onClick={() => handleFilter(option.label)}
                                        >
                                            {option.label}
                                        </div>
                                    )}
                                </Menu.Item>
                            )
                        })}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default DropDown