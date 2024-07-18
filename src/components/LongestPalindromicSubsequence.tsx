import {useEffect, useState} from "react";

const LongestPalindromicSubsequence = () => {
    const [input, setInput] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [arrayResult, setArrayResult] = useState<string>('');
    const [warning, setWarning] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [onRun, setOnRun] = useState(false);
    const startCut = () => {
        setArrayResult('');
        setOnRun(true);
        setIsLoading(true);
    }


    const handleCutString = () => {
        console.log(input)
        const n = input.length;
        const matrixDP = Array.from({length: n}, () => Array(n).fill(false));
        const cuts = Array.from({length: n}, (_, i) => i);
        // Xác định các xâu con đối xứng
        for (let len = 1; len <= n; len++) {
            for (let i = 0; i <= n - len; i++) {
                const j = i + len - 1;
                if (input[i] === input[j] && (len <= 2 || matrixDP[i + 1][j - 1])) {
                    matrixDP[i][j] = true;
                    cuts[j] = i === 0 ? 0 : Math.min(cuts[j], cuts[i - 1] + 1);
                }
            }
        }
        console.log('n: ', n);
        console.log(matrixDP);
        console.log(cuts);
        //
        //  // Truy vết để tìm cách cắt
        let i = n - 1;
        const result = [];
        while (i >= 0) {
            console.log('At index i: ', i);
            if (cuts[i] === 0) {
                result.unshift(input.substring(0, i + 1));
                break;
            }
            for (let j = i; j >= 0; j--) {
                if (matrixDP[j][i] && cuts[j - 1] === cuts[i] - 1) {
                    result.unshift(input.substring(j, i + 1));
                    i = j - 1;
                    break;
                }
            }
            console.log('Result at i: ', result);
        }
        setArrayResult(result.join(' và '));
        setOnRun(false);
    }
    useEffect(() => {
        if (onRun) {
            setTimeout(() => {
                handleCutString()
            }, 1000)
        } else {
            setIsLoading(false);
        }
    }, [onRun]);
    useEffect(() => {
        if (input.length > 5000) {
            setWarning(true);
        } else {
            setWarning(false);
        }
    }, [input]);
    return (
        <div className={'p-3'}>
            <h1 className={'bg-green-100 text-green-500 p-2'}>Chuỗi đối xứng</h1>
            <div className={'flex flex-col gap-2'}>
                <textarea value={input} onChange={(e) => setInput(e?.target?.value)}
                          className={'placeholder-gray-50-100 outline-0 border-gray-100 border p-3 min-w-[400px]'}
                          placeholder={'Nhập chuỗi..'}/>
                {warning && <span className={'text-red-400'}>Tối đa 5000 kí tự</span>}
                <div className={'flex flex-row gap-4'}>
                    <button disabled={!input || warning} onClick={() => startCut()}
                            className={'disabled:bg-gray-200 disabled:hover:cursor-not-allowed text-gray-500 border-green-600 border p-2 w-[100px] rounded-[5px] hover:text-green-500 transition-all '}>Cắt
                    </button>
                    <button onClick={() => {
                        setInput('');
                        setArrayResult('');
                    }}
                            className={'text-gray-500 border-amber-600 border p-2 w-[100px] rounded-[5px] hover:text-green-500 transition-all '}>Xoá
                    </button>

                </div>
                <div>{isLoading && <span>Đang xử lí, vui lòng đợi...</span>}</div>
                <div className={'bg-gray-100 text-green-500 p-2'}>
                    <p>Result: <div className={'text-red-400 h-auto  max-w-[1000px] overflow-scroll break-words'}>{
                        arrayResult
                    }</div></p>
                </div>
            </div>
        </div>
    );
};

export default LongestPalindromicSubsequence;