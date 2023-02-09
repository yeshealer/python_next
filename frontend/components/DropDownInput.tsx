import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'
import CreatableSelect from 'react-select/creatable'
import { toast } from 'react-toastify';
import { dataListTypes, OptionTypes, updateLocalData, randomColor } from './MainSection'

interface DropDownInputProps {
    selectedTag: string;
    selectedColor: string;
    setOptions: Dispatch<SetStateAction<OptionTypes[]>>;
    options: OptionTypes[];
    setDataList: Dispatch<SetStateAction<dataListTypes[]>>;
    dataList: dataListTypes[];
    index: number;
}

const DropDownInput: React.FC<DropDownInputProps> = ({
    selectedTag,
    selectedColor,
    setOptions,
    options,
    setDataList,
    dataList,
    index
}) => {
    const [showTag, setShowTag] = useState<string>('')
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [bgColor, setBgColor] = useState('black')

    const tagSelectedMsg = () => toast.info('Tag Selected!')

    useEffect(() => {
        if (selectedTag !== '') {
            setIsEdit(true)
            setShowTag(selectedTag)
            setBgColor(selectedColor)
        }
    }, [selectedTag, showTag, selectedColor])

    const setValue = options.filter((option) => {
        return option.value === selectedTag
    })

    const handleChange = (option: OptionTypes | null) => {
        if (option) {
            if (!options.includes(option)) {
                setOptions([...options, option])
                const storeData = [...options, option].map((option) => {
                    return JSON.stringify(option)
                })
                localStorage.setItem('options', JSON.stringify(storeData))
            }
            const currentColor = randomColor(option.label)
            setShowTag(option.label)
            setIsEdit(true)
            setBgColor(currentColor)
            const updateDataList = dataList.map((listData, indexNumber) => {
                if (indexNumber === index) {
                    listData.tag = option.value
                    listData.color = currentColor
                }
                return listData
            })
            setDataList(updateDataList)
            updateLocalData(updateDataList)
            tagSelectedMsg()
        }
    }

    const handleEdit = () => {
        setIsEdit(false);
    }
    return (
        !isEdit ? <CreatableSelect options={options} defaultValue={setValue} onChange={(option: OptionTypes | null) => handleChange(option)} className="min-w-[120px]" />
            :
            <div className='flex gap-3 justify-between'>
                <div className={`text-white rounded-full p-0.5 px-3`} style={bgColor ? { backgroundColor: bgColor } : { backgroundColor: 'black' }}>{showTag}</div>
                <div className='text-sky-500 cursor-pointer' onClick={() => handleEdit()}>edit</div>
            </div>

    )
}

export default DropDownInput