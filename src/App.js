import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { createContext, useEffect, useState } from 'react';
import { boardDefault , generateWordSet} from "./Words";
import GameOver from "./components/GameOver";


export const AppContext = createContext();

function App(){
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrentAttempt] = useState({attemp: 0 , letterPos: 0});
  const [wordSet, setWordSet ] = useState(new Set())
  const [disabledLetters, setDisabledLetters] = useState([])
  const [correctWord, setCorrectWord] = useState("");
  const [gameOver , setGameOver] = useState({
    gameOver: false,
    guessedWord: false
  });

  // const correctWord = "RIGHT";
 
  useEffect(()=>{
    generateWordSet().then((words) => {
       console.log(words)
      setWordSet(words.wordSet)
      setCorrectWord(words.todaysWord)
    })
  },[])

  const onSelectLetter = (keyVal) =>{
    if(currAttempt.letterPos > 4) return;
    const newBoard = [...board];
    newBoard[currAttempt.attemp][currAttempt.letterPos] = keyVal;
    setBoard(newBoard);
    setCurrentAttempt({...currAttempt, letterPos: currAttempt.letterPos+1})
  }

  const onDelete = () =>{
    if(currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attemp][currAttempt.letterPos - 1] = "";
    setBoard(newBoard);
    setCurrentAttempt({...currAttempt, letterPos: currAttempt.letterPos - 1})
  }

  const onEnter = () =>{
    if(currAttempt.letterPos !== 5) return;
    let currWord  ="";
    for(let i =0 ; i< 5; i++){
      currWord += board[currAttempt.attemp][i];
    }
    console.log(wordSet)
    if(wordSet.has(currWord.toLowerCase())){
      setCurrentAttempt({attemp: currAttempt.attemp + 1, letterPos: 0});  
    }else{
      alert("Word Not Found")
    }

    if(currWord === correctWord){
      setGameOver({gameOver: true, guessedWord: true})
      return;
    }

    if(currAttempt.attemp === 5 ){
      setGameOver({gameOver: true, guessedWord: false })
    }
  }
  return(
    <div className="App">
      <nav><h1>Wordle</h1></nav>
      <AppContext.Provider 
        value={{ 
          board,
          setBoard,
          currAttempt,
          setCurrentAttempt, 
          onSelectLetter, 
          onDelete, 
          onEnter, 
          setGameOver,
          gameOver,
          setDisabledLetters,
          disabledLetters,
          correctWord}}>
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
