import Link from "next/link";
import styled from '@emotion/styled';
import { keyframes } from "@emotion/react";

export default function Home() {
  return (
    <>
      <main>
        <Container>
          <Link href="/setup" passHref>
            <StartGameButton>게임 시작</StartGameButton>
          </Link>
          <Link href="/record" passHref>
            <Button className="record">저장된 게임</Button>
          </Link>
        </Container>
      </main >
    </>
  );
}
const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
  gap: 20px;
`;
const Button = styled.button`
  background-color: #007bff; 
  color: #fff; 
  padding: 15px 30px;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer; 
  transition: background-color 0.2s, transform 0.2s; 
  &:hover {
    background-color: #0056b3;
    transform: scale(1.05); 
    border-color: #fff; 
  }
  &.records {
    background-color: #28a745; 
    &:hover {
      background-color: #218838; 
    }
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
const StartGameButton = styled(Button)`
  background-color: #28a745; // "게임 시작" 버튼의 배경색 변경
  &:hover {
    background-color: #218838; // 호버 시 배경색 변경
    border-color: #fff; // 호버 시 테두리색 변경
  }
  animation: ${bounce} 1s infinite alternate; // 애니메이션 적용
`;