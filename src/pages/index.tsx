import Link from "next/link";
import styled from '@emotion/styled';

export default function Home() {
  return (
    <>
      <main>
        <div>commit test</div>
        <Container>
          <Link href="/setup" passHref>
            <Button>게임 시작</Button>
          </Link>
          <Link href="/records" passHref>
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