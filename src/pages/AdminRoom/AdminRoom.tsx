import { useParams } from "react-router-dom";
import { useState, type FormEvent } from "react";

import logoImg from "../../assets/images/logo.svg";
import { Button } from "../../components/Button/Button";
import { RoomCode } from "../../components/RoomCode/RoomCode";
import "../../styles/room.scss";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";
import { child, push, ref, set } from "firebase/database";
import { Question } from "../../components/Question/Question";
import { useRoom } from "../../hooks/useRoom";

//Tipando os parametros da rota
type RoomParams = {
  id: string;
};
export const AdminRoom = () => {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const { questions, title } = useRoom(params.id);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="imagem logo let me ask" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined>Sair da sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
