import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { GameSettings } from '@/types';

const initialSettings: GameSettings = {
    boardSize: 3,
    winCondition: 3,
    player1: { mark: 'X', color: '#0000FF' },
    player2: { mark: 'O', color: '#FF0000' },
    firstPlayer: 'random',
}

const SetupIndex = () => {
    const [settings, setSettings] = useState<GameSettings>(initialSettings);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, field: string) => {
        const { value, name } = e.target;
        if (field === 'boardSize' || field === 'winCondition') {
            setSettings((prevSettings) => ({
                ...prevSettings,
                [field]: parseInt(value, 10),
            }));
        } else if (field === 'player1' || field === 'player2') {
            setSettings((prevSettings) => ({
                ...prevSettings,
                [field]: {
                    ...prevSettings[field],
                    [name]: name === 'color' ? value : value,
                },
            }));
        } else {
            setSettings((prevSettings) => ({
                ...prevSettings,
                [field]: value,
            }));
        }
    }

    const saveSettingsAndStartGame = () => {
        localStorage.setItem('gameSettings', JSON.stringify(settings));
        router.push('/game');
    }

    // 메인 렌더링 로직 ===================================================================================
    return (
        <Container>
            <Title>게임설정</Title>

            <FieldGroup>
                <Label htmlFor="">게임판 크기: </Label>
                <Select name="boardSize" value={settings.boardSize} id="" onChange={(e) => handleInputChange(e, 'boardSize')}>
                    <option value="3">3x3</option>
                    <option value="4">4x4</option>
                    <option value="5">5x5</option>
                </Select>
            </FieldGroup>
            <FieldGroup>
                <Label htmlFor="">승리 조건: </Label>
                <Select name="winCondition" value={settings.winCondition} id="" onChange={(e) => handleInputChange(e, 'winCondition')}>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </Select>
            </FieldGroup>
            <Wrapper>
                <SubTitle>플레이어 1</SubTitle>
                <div>
                    <Label htmlFor="">마크: </Label>
                    <Input type="text" name="mark" value={settings.player1.mark} onChange={(e) => handleInputChange(e, 'player1')} />
                </div>
                <div>
                    <Label htmlFor="">색상: </Label>
                    <Input type="color" name="color" value={settings.player1.color} onChange={(e) => handleInputChange(e, 'player1')} />
                </div>
            </Wrapper>
            <Wrapper>
                <SubTitle>플레이어 2</SubTitle>
                <div>
                    <Label htmlFor="">마크: </Label>
                    <Input type="text" name="mark" value={settings.player2.mark} onChange={(e) => handleInputChange(e, 'player2')} />
                </div>
                <div>
                    <Label htmlFor="">색상: </Label>
                    <Input type="color" name="color" placeholder={settings.player2.color} value={settings.player2.color} onChange={(e) => handleInputChange(e, 'player2')} />
                </div>
            </Wrapper>
            <div>
                <Label htmlFor="">먼저 시작하는 플레이어: </Label>
                <Select name="firstPlayer" value={settings.firstPlayer} id="" onChange={(e) => handleInputChange(e, 'firstPlayer')}>
                    <option value="random">랜덤</option>
                    <option value="player1">플레이어 1</option>
                    <option value="player2">플레이어 2</option>
                </Select>
            </div>

            <ButtonWrapper>
                <StyledButton onClick={saveSettingsAndStartGame}>게임 시작</StyledButton>
            </ButtonWrapper>
        </Container>
    );
}
export default SetupIndex;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;
const Title = styled.h2`
  color: #007bff;
  font-size: 24px;
  font-weight: bold;
`;
const StyledButton = styled.button`
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
    border-color: #fff;
  }
  margin: 0 5px; 
`;
const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;
const Input = styled.input`
  padding: ${(props) => (props.type === 'color' ? '0' : '10px')};
  border-radius: ${(props) => (props.type === 'color' ? '0' : '10px')}; 
  border: ${(props) => (props.type === 'color' ? '0px solid #007bff' : '1px solid #ccc')};
  margin: 5px 0;
  width: ${(props) => (props.type === 'color' ? '50px' : '200px')};
  height: ${(props) => (props.type === 'color' ? '50px' : 'auto')};
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
`;
const Select = styled.select`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin: 5px 0;
  width: 210px; 
  cursor: pointer;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background-color: #f8f9fa;
`;
const Label = styled.label`
  font-weight: bold;
  color: #333;
`;
const FieldGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; 
  max-width: 320px; 
  margin: 5px 0;
`;
const SubTitle = styled.h3`
  color: #007bff;
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 10px; 
`;