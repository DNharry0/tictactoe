import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import Link from "next/link";
import { GameSettings } from '@/types';

const GameIndex = () => {
    const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
    const [board, setBoard] = useState<(string | null)[][]>([]);
    const [currentTurn, setCurrentTurn] = useState<'player1' | 'player2'>('player1');
    const [winner, setWinner] = useState<string | null>(null);
    const [player1, setPlayer1] = useState({ mark: 'X', color: '#0000FF', undoCount: 3 });
    const [player2, setPlayer2] = useState({ mark: 'O', color: '#FF0000', undoCount: 3 });
    const [gameHistory, setGameHistory] = useState<(string | null)[][][]>([]);
    const [moveOrder, setMoveOrder] = useState<(number | null)[][]>([]);

    useEffect(() => {
        const settings = localStorage.getItem('gameSettings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            setGameSettings(parsedSettings);
            const initialBoard = Array(parsedSettings.boardSize).fill(null).map(() => Array(parsedSettings.boardSize).fill(null));
            setBoard(initialBoard);
            setGameHistory([initialBoard]);

            if (parsedSettings.firstPlayer === 'random') {
                setCurrentTurn(Math.random() > 0.5 ? 'player1' : 'player2');
            } else {
                setCurrentTurn(parsedSettings.firstPlayer);
            }
        }
    }, []);

    useEffect(() => {
        if (gameSettings) {
            const { player1: settingsPlayer1, player2: settingsPlayer2 } = gameSettings;
            setPlayer1(prev => ({ ...prev, mark: settingsPlayer1.mark, color: settingsPlayer1.color }));
            setPlayer2(prev => ({ ...prev, mark: settingsPlayer2.mark, color: settingsPlayer2.color }));
        }
    }, [gameSettings]);

    useEffect(() => {
        const initialMoveOrder = Array(gameSettings?.boardSize).fill(null).map(() => Array(gameSettings?.boardSize).fill(null));
        setMoveOrder(initialMoveOrder);
    }, [gameSettings]);

    // 게임 로직 처리 =======================================================================================
    const handleClick = (row: number, col: number) => {
        if (board[row][col] || winner) return;
        const newBoard = board.map(row => [...row]);
        const playerMark = gameSettings && gameSettings[currentTurn] ? gameSettings[currentTurn].mark : '';
        newBoard[row][col] = playerMark;
        setBoard(newBoard);
        checkForWinner(newBoard, row, col);

        if (!winner) checkForDraw(newBoard);
        setCurrentTurn(currentTurn === 'player1' ? 'player2' : 'player1');

        const newMoveOrder = [...moveOrder];
        newMoveOrder[row][col] = gameHistory.length;
        setMoveOrder(newMoveOrder);
    };

    const checkForWinner = (board: (string | null)[][], row: number, col: number) => {
        const currentMark = board[row][col];
        if (!currentMark) return;

        const directions = [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: -1 }
        ];

        const winCondition = gameSettings ? gameSettings.winCondition : 3;
        const checkDirection = (dx: number, dy: number) => {
            let count = 1;
            for (let i = 1; i < winCondition; i++) {
                const nx = row + dx * i;
                const ny = col + dy * i;
                if (nx >= 0 && nx < board.length && ny >= 0 && ny < board[nx].length && board[nx][ny] === currentMark) {
                    count++;
                } else {
                    break;
                }
            }
            for (let i = 1; i < winCondition; i++) {
                const nx = row - dx * i;
                const ny = col - dy * i;
                if (nx >= 0 && nx < board.length && ny >= 0 && ny < board[nx].length && board[nx][ny] === currentMark) {
                    count++;
                } else {
                    break;
                }
            }
            return count >= winCondition;
        };

        for (let direction of directions) {
            if (checkDirection(direction.x, direction.y)) {
                setWinner(currentTurn === 'player1' ? '플레이어 1' : '플레이어 2');
                return;
            }
        }

        setGameHistory([...gameHistory, board]);
    };

    const checkForDraw = (board: (string | null)[][]) => {
        const isDraw = board.every(row => row.every(cell => cell !== null));
        if (isDraw) {
            setWinner('무승부');
        }
    };

    const handleUndo = () => {
        if (gameHistory.length > 1) {
            const previousState = gameHistory[gameHistory.length - 2];
            setBoard(previousState);
            setGameHistory(gameHistory.slice(0, -1));

            if (currentTurn === 'player1' && player1.undoCount > 0) {
                setPlayer1({ ...player1, undoCount: player1.undoCount - 1 });
            } else if (currentTurn === 'player2' && player2.undoCount > 0) {
                setPlayer2({ ...player2, undoCount: player2.undoCount - 1 });
            }

            setCurrentTurn(currentTurn === 'player1' ? 'player2' : 'player1');
        } else {
            console.log("무르기를 할 수 없습니다.");
        }
    };

    const handleGameOver = () => {
        if (winner) {
            localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
            localStorage.setItem('finalBoardState', JSON.stringify(board));
        }
    };

    useEffect(() => {
        if (winner) {
            handleGameOver();
        }
    })

    // 렌더링 관련 함수(시작)====================================================================================
    const renderGameBoard = () => {
        return (
            <GameBoard size={gameSettings?.boardSize || 3}>
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <GameCell
                            key={`${rowIndex}-${colIndex}`}
                            color={cell ? (cell === player1.mark ? player1.color : player2.color) : 'transparent'}
                            onClick={() => winner ? null : handleClick(rowIndex, colIndex)}
                        >
                            {cell && `${cell} (${(moveOrder[rowIndex]?.[colIndex] ?? -0) + 0})`}
                        </GameCell>
                    ))
                )}
            </GameBoard>
        );
    };

    const renderPlayerInfo = () => {
        const currentPlayer = currentTurn === 'player1' ? player1 : player2;
        return (
            <div>
                <div>현재 플레이어 차례: <span>{currentPlayer.mark}</span> <ColorIndicator color={currentPlayer.color} /></div>
                <p>남은 무르기 횟수: {currentPlayer.undoCount}회</p>
                {winner === null && (
                    <BackButton disabled={currentPlayer.undoCount <= 0} onClick={handleUndo}>무르기</BackButton>
                )}
            </div>
        );
    };
    // 렌더링 관련 함수(끝)====================================================================================


    //메인 렌더링 로직 =======================================================================================
    if (!gameSettings) return <div>게임 설정을 불러올 수 없습니다.</div>;

    return (
        <PageContainer>
            <h1>게임 페이지</h1>
            {renderPlayerInfo()}
            {winner ?
                <Result>{winner === '무승부' ? '무승부' : `${winner} 승리`}</Result>
                :
                null
            }

            <GameBoardWrapper>
                {renderGameBoard()}
            </GameBoardWrapper>

            <Link href="/" passHref>
                <HomeButton>홈으로</HomeButton>
            </Link>
        </PageContainer>
    );
}
export default GameIndex;

const GameBoardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;
const GameBoard = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  gap: 5px;
  justify-content: center;
  align-items: center;
  border: 5px solid #000;
  padding: 10px;
`;
const GameCell = styled.button<{ color: string }>`
  width: 20vw; 
  height: 20vw;
  min-width: 70px;
  min-height: 70px;
  max-width: 100px;
  max-height: 100px;
  background-color: ${props => props.color || '#f0f0f0'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  border: 1px solid #131111; 
  cursor: pointer;
`;
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
const HomeButton = styled.button`
  margin-top: 20px; 
  padding: 10px 20px; 
  font-size: 16px; 
  cursor: pointer;
  background-color: #0070f3; 
  color: white;
  border: none;
  border-radius: 5px; 

  &:hover {
    background-color: #0056b3;
  }
`;
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;
const Result = styled.h2`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50; 
    color: white;
    font-size: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
    animation: ${bounce} 1s infinite alternate; 

    &:hover {
        transform: translateY(-5px);
    }
`;
const BackButton = styled.button`
    padding: 10px 20px;
    background-color: #0070f3; 
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.5rem;
    cursor: pointer;
    margin-top: 20px;
    
    &:hover {
        background-color: #0056b3;
    }
    &:disabled {
        background-color: #ccc; 
        cursor: not-allowed;
    }
`;
const ColorIndicator = styled.div<{ color: string }>`
  display: inline-block;
  width: 15px;
  height: 15px;
  background-color: ${props => props.color};
  margin-left: 5px;
`;