import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { __deleteDetail, __getDetail } from '../redux/module/DetailSlice';
import { useNavigate, useParams } from 'react-router-dom';
import useInput from '../hooks/useInput';

// props로 받은 question state
const Detail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const { hellMode } = useSelector((state) => state.theme);
  const { isLoading, error, question } = useSelector((state) => state.detail); // global state
  const [writer, onChangeWriter] = useInput('');
  const [password, onChangePassword] = useInput('');

  useEffect(() => {
    dispatch(__getDetail(id));
  }, []);

  if (isLoading) {
    return <div>로딩중 입니다.</div>;
  }
  if (error) {
    return <div>존재하지 않는 페이지 입니다..</div>;
  }

  // 삭제 버튼
  const deleteButton = (event, id) => {
    event.preventDefault();
    // const reCheck = window.confirm('정말 삭제하시겠습니까?'); // confirm 으로 재확인
    if (writer.replace(/ /g, '') === '') {
      alert('(이름)작성자)를 입력해주세요!');
      return;
    } else if (question.writer !== writer) {
      alert('(이름)작성자가 다릅니다');
      return;
    } else if (password.replace(/ /g, '') === '' || password.length !== 4) {
      alert('비밀번호는 4자리 숫자로 입력해주세요!');
      return;
    } else if (question.password !== Number(password)) {
      alert('비밀번호는 숫자입니다');
      return;
    } else if (window.confirm('정말 삭제하시겠습니까?')) {
      dispatch(__deleteDetail(id)); // DetailSlice >> deleteDetail (action)
      navigation('/'); // main page로 돌아가기
    } else {
      return;
    }
  };

  // 수정 버튼
  const updateButton = (event) => {
    event.preventDefault();
    // 토글 수정, 완료
    setEdit(!edit);
  };

  // (수정)완료 버튼
  const completeButton = (event) => {
    event.preventDefault();
    console.log('완료');
  };

  return (
    <Wrapper>
      <QuestionHead key={question.id}>
        {/* 사이트 네임 태그 */}
        <Place>{question.place}</Place>
        {/* 언어 태그 */}
        <Language hellMode={hellMode}>
          <span className="dot" />
          {question.language}
        </Language>
      </QuestionHead>
      <QuestionTitle>
        <TitleFont>{question.title}</TitleFont>
        <form>
          <InputNamePassword
            type="text"
            placeholder="이름 입력"
            onChange={onChangeWriter}
          />
          <InputNamePassword
            type="Number"
            placeholder="비밀번호 입력"
            onChange={onChangePassword}
          />
          {edit ? (
            <AddButton onClick={(event) => completeButton(event)}>
              완료
            </AddButton>
          ) : (
            <AddButton onClick={(event) => updateButton(event)}>수정</AddButton>
          )}

          <AddButton onClick={(event) => deleteButton(event, question.id)}>
            삭제
          </AddButton>
        </form>
      </QuestionTitle>
      <QuestionLink>Link</QuestionLink>
      <QuestionContent>{question.content}</QuestionContent>
      <QuestionCode>
        <CodeName>소스 코드</CodeName>
        <span>const nanana = banana;</span>
      </QuestionCode>
    </Wrapper>
  );
};

export default Detail;

// styled component

const QuestionContent = styled.p`
  color: ${(props) => props.theme.colors.textcolor};
`;

const Wrapper = styled.div`
  border: 1px solid red;
  width: 50%;
  padding: 24px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.card};
`;

const QuestionHead = styled.header`
  display: flex;
  justify-content: space-between;
  padding-bottom: 32px;
`;
const Place = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.children === 'baekjoon'
      ? props.theme.colors.baekjoon
      : props.children === 'programmers'
      ? props.theme.colors.programmers
      : props.theme.colors.swexpert};
  color: black;
`;

const Language = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 0 10px;
  gap: 10px;
  color: ${(props) => (props.hellMode === true ? '#FF2525' : '#FFFFFF')};
  span {
    height: 12px;
    width: 12px;
    background-color: ${(props) => props.theme.colors.pointcolor};
    border-radius: 50%;
  }
`;
const QuestionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
`;
const TitleFont = styled.h1`
  font-size: 1.5vw;
  font-weight: bold;
`;
const InputNamePassword = styled.input`
  width: 190px;
  height: 40px;
  background-color: ${(props) => props.theme.colors.insidecard};
  border-radius: 20px;
  position: relative;
  border: none;
  color: ${(props) => props.theme.colors.textcolor};
  margin-top: 40px;
  left: 41%;
  margin-left: 10px;
  padding-left: 16px;
  &::placeholder {
    padding-left: 2px;
    color: ${(props) => props.theme.colors.placeholder};
  }
  &:focus {
    box-shadow: 3px 3px 5px #aaa;
    scale: 1.01;
  }
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const AddButton = styled.button`
  height: 40px;
  background-color: transparent;
  border: transparent;
  color: ${(props) => props.theme.colors.pointcolor};
  position: relative;
  cursor: pointer;
`;
const QuestionLink = styled.a`
  color: ${(props) => props.theme.colors.pointcolor};
  font-weight: bold;
`;

const QuestionCode = styled.section`
  width: 100%;
  height: 300px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.insidecard};
`;
const CodeName = styled.p`
  color: ${(props) => props.theme.colors.pointcolor};
  font-weight: bold;
`;
