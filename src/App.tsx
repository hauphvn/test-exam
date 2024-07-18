import './App.css'
import LongestPalindromicSubsequence from "./components/LongestPalindromicSubsequence.tsx";
import Board from "./components/Sodoku/Board.tsx";

function App() {

    return (
        <>
            <div>
                <hr/>
                <LongestPalindromicSubsequence/>
                <hr/>
                <Board/>
                <hr/>
            </div>
        </>
    )
}

export default App
