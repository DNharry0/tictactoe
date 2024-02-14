import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Link from 'next/link';

const RecordIndex = () => {
    const [gameHistory, setGameHistory] = useState<(string | null)[][][]>([]);
    const [finalBoardState, setFinalBoardState] = useState<(string | null)[][] | null>(null);

    useEffect(() => {
        const storedGameHistory = localStorage.getItem('gameHistory');
        const storedFinalBoardState = localStorage.getItem('finalBoardState');

        if (storedGameHistory) {
            setGameHistory(JSON.parse(storedGameHistory));
        }
        if (storedFinalBoardState) {
            setFinalBoardState(JSON.parse(storedFinalBoardState));
        }
    }, []);

    const renderFinalBoardState = () => {
        if (!finalBoardState) return <p>게임 데이터가 없습니다.</p>;

        const clickOrderMap = new Map();

        gameHistory.forEach((boardState, turnIndex) => {
            boardState.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    const key = `${rowIndex}-${colIndex}`;
                    if (cell !== null && !clickOrderMap.has(key)) {
                        clickOrderMap.set(key, turnIndex + 0);
                    }
                });
            });
        });

        return (
            <GameBoard size={finalBoardState.length}>
                {finalBoardState.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const order = clickOrderMap.get(`${rowIndex}-${colIndex}`) || 'last';
                        return (
                            <GameCell
                                key={`${rowIndex}-${colIndex}`}
                                color={getCellColor(cell)}
                            >
                                <CellContent>
                                    {cell ? `${cell} (${order})` : ''}
                                </CellContent>
                            </GameCell>
                        );
                    })
                )}
            </GameBoard>
        );
    };

    const getCellColor = (cell: string | null) => {
        if (cell === 'X') {
            return '#0000FF';
        } else if (cell === 'O') {
            return '#FF0000';
        } else {
            return 'transparent';
        }
    };

    // 메인 렌더링 로직 ===================================================================================
    return (
        <PageContainer>
            <h1>이전 게임 결과 보기</h1>
            {renderFinalBoardState()}
            <Link href="/">
                <Button>홈으로 돌아가기</Button>
            </Link>
        </PageContainer>
    );
};
export default RecordIndex;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const GameBoard = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  gap: 5px;
  width: 80vw;
  max-width: 500px;
`;

const GameCell = styled.div<{ color: string }>`
  width: 100%;
  padding-top: 100%; 
  position: relative;
  background-color: ${props => props.color || '#f0f0f0'};
  border: 1px solid #131111;
`;

const CellContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  margin-top: 20px;
`;