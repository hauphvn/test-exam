import React, {useEffect, useState} from 'react';

interface SudokuCellProps {
    value: number;
    isInitial: boolean;
    isSelected: boolean;
    onClick: () => void;
    className?: string;
    onFill?:(value: number) => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({ value, isInitial, isSelected, onClick , className = '', onFill = () => null}) => {
    const [valueState, setValueState] = useState(value);
    useEffect(() => {
        setValueState(value);
    }, [value]);
    return (
        <input
            // type={'number'}
            className={`w-[50px] h-[50px] text-center rounded-[2px] flex justify-center items-center 
            ${(isSelected && value === 0) ? ' bg-white' : 'bg-green-100'} ${value === 0 ? ' cursor-pointer' : 'cursor-default'} ${className}`}
            onClick={onClick}
            readOnly={isInitial}
            value={valueState === 0 ? '' : valueState}
            onChange={(e) => onFill(+e?.target?.value)}
        />

    );
};

export default SudokuCell;