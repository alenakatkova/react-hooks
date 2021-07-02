// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onSquareClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSquareClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState(
    'history',
    [Array(9).fill(null)]
  )
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'currentStep',
    0
  )
  const nextValue = calculateNextValue(history[currentStep])
  const winner = calculateWinner(history[currentStep])
  const status = calculateStatus(winner, history[currentStep], nextValue)

  function selectSquare(square) {
    if (winner || history[currentStep][square]) return

    const squaresCopy = [...history[currentStep]]
    squaresCopy[square] = nextValue
    const newHistory = history.slice(0, currentStep + 1)

    setHistory([...newHistory, squaresCopy])
    setCurrentStep(currentStep + 1)
  }

  function restart() {
    const initialSquares = Array(9).fill(null)
    setCurrentStep(0)
    setHistory([initialSquares])
  }

  function selectStep(i) {
    setCurrentStep(i)
  }

  const moves = history.map((item, index) => {
    const isCurrentStep = index === currentStep
    const stepText = index !== 0
      ? `Go to move #${index}`
      : `Go to game start`
    return (
      <li key={index}>
        <button
          onClick={() => selectStep(index)}
          disabled={isCurrentStep}
        >
          {stepText} {isCurrentStep ? '(current)' : null}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onSquareClick={selectSquare} squares={history[currentStep]} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
