import React, {useState, useEffect} from 'react';
import SudokuCell from './Cell';

const SudokuBoard: React.FC = () => {
    const [board, setBoard] = useState<number[][]>([]);
    const [initialBoard, setInitialBoard] = useState<number[][]>([]);
    const [userFillBoard, setUserFillBoard] = useState<boolean[][]>([]);
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [inValidAt, setInvalidAt] = useState([-1, -1]);
    useEffect(() => {
        newGame();
        setInvalidAt([-1, -1]);
    }, []);
    useEffect(() => {
        userFill();
    }, [initialBoard, board]);
    const newGame = () => {
        const newBoard = generateSudoku();
        setBoard(newBoard);
        setInitialBoard(newBoard.map(row => [...row]));
    }
    const handleCellClick = (row: number, col: number) => {
        setSelectedCell([row, col]);
    };

    const handleNumberInput = (number: number) => {
        if (selectedCell) {
            const [row, col] = selectedCell;
            if (initialBoard[row][col] === 0) {
                const cloneBoard = board.map(r => [...r]);
                const newBoard = board.map(r => [...r]);
                newBoard[row][col] = number;
                setBoard(newBoard);
                if (!isCheckValueFill(cloneBoard, row, col, number)) {
                    setInvalidAt([row, col]);
                } else {
                    setInvalidAt([-1, -1]);
                }
                if (isFinished(newBoard)) {
                    alert('Bạn thật giỏi! Sudoku đã được giải!');
                }
            }
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const userFill = () => {
        if (!board.length || !initialBoard.length) return;
        const userBoardFill: boolean[][] = Array(9).fill(null).map(() => Array(9).fill(false));
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                userBoardFill[i][j] = initialBoard[i][j] === 0 && board[i][j] !== 0;
            }
        }
        setUserFillBoard(userBoardFill);
    }

    function generateSudoku(): number[][] {
        const board: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
        const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
            for (let x = 0; x < 9; x++) {
                if (board[row][x] === num || board[x][col] === num) {
                    return false;
                }
            }

            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i + startRow][j + startCol] === num) {
                        return false;
                    }
                }
            }

            return true;
        };

        const fillBoard = (board: number[][]): boolean => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (isValid(board, row, col, num)) {
                                board[row][col] = num;
                                if (fillBoard(board)) {
                                    return true;
                                }
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        };

        fillBoard(board);

        const resetBoard = 50; // Change mode: easy, medium, hard
        for (let i = 0; i < resetBoard; i++) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            board[row][col] = 0;
        }

        return board;
    }

    const isFinished = (board: number[][]): boolean => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return false;
            }
        }
        return true;
    }
    const isCheckValueFill = (oldBoard: number[][], row: number, col: number, num: number): boolean => {
        console.log(oldBoard);
        console.log(row, col, num);
        for (let x = 0; x < 9; x++) {
            if (oldBoard[row][x] === num) return false;
        }
        for (let x = 0; x < 9; x++) {
            if (oldBoard[x][col] === num) return false;
        }
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (oldBoard[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    }

    // Using recursive to solve sudoku
    const solveSudoku = async (boardTemp: number[][]):Promise<boolean> => {
        const emptyCell = findEmptyCell(boardTemp);
        if (!emptyCell) {
            return true;
        }

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (isCheckValueFill(boardTemp, row, col, num)) {
                boardTemp[row][col] = num;

                if (await solveSudoku(boardTemp)) {
                    return true;
                }

                boardTemp[row][col] = 0;
            }
        }

        return false;
    }

    const onHandleSolve = async () => {
        const cloneBoard = board.map(r => [...r]);
        const success = await solveSudoku(cloneBoard);
        if(success){
            setBoard(cloneBoard)
        }else{
            alert("Hệ thống bị lỗi, nên tạm thời không gửi lời giải cho bạn được, hẹn bạn lúc khác!!");
        }
    }

    const findEmptyCell = (board: number[][]): [number, number] | null => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null;
    }
    console.log(board)
    return (
        <div className={'flex flex-row'}>
            <div>
                <div className={'border-amber-600 border w-fit'}
                     style={{display: 'grid', gridTemplateColumns: 'repeat(9, 50px)', gap: '1px', margin: '20px'}}>
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                className={`${(inValidAt[0] === rowIndex && inValidAt[1] === colIndex) ? 'text-red-400' : (!!userFillBoard?.length && !userFillBoard[rowIndex][colIndex]) ? 'text-black' : 'text-green-500'} w-[51px] h-[51px]`}
                                key={`${rowIndex}-${colIndex}`}>
                                <SudokuCell
                                    className={`${[2, 5].includes(rowIndex) ? 'border-b border-black' : ''} ${[2, 5].includes(colIndex) ? 'border-r border-black' : ''}`}
                                    key={`${rowIndex}-${colIndex}`}
                                    value={cell}
                                    isInitial={initialBoard[rowIndex][colIndex] !== 0}
                                    isSelected={selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    onFill={(value) => handleNumberInput(+value)}
                                />
                            </div>
                        ))
                    )}
                </div>
                <div className={'flex gap-3'}>
                    <button onClick={() => newGame()} className={'p-3 border-green-500 border rounded-[5px]'}>Tạo đề
                        mới
                    </button>
                    <button className={'p-3 border-red-500 border rounded-[5px]'} onClick={onHandleSolve}>Đáp án
                    </button>
                </div>
            </div>
            <div>
                <h1 className={'font-bold text-[30px] text-gray-500'}>SODOKU</h1>
                <p>Số màu <span className={'bold'}>đen</span> là của đề bài</p>
                <p>Số màu <span className={'text-green-500'}>xanh</span> là của bạn</p>
                <p>Số màu <span className={'text-red-500'}>đỏ</span> là sai</p>
            </div>
        </div>
    );
};

export default SudokuBoard;