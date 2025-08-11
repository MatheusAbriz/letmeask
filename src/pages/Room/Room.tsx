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
export const Room = () => {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const { questions, title } = useRoom(params.id);

  const handleSendQuestion = async (event: FormEvent) => {
    event.preventDefault();
    if (newQuestion.trim() == "") return;

    if (!user) {
      throw new Error("Você deve estar logado");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    //Pegando uma chave pra nao alterar uma pergunta ja existente
    const newQuestionKey = push(child(ref(database), "rooms/questions")).key;

    await set(
      ref(database, `rooms/${params.id}/questions/${newQuestionKey}`),
      question
    );

    setNewQuestion("");
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="imagem logo let me ask" />
          <RoomCode code={params.id} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <button
               className="like-button"
               type="button"
               aria-label="Marcar como gostei"
              >
                <span>10</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12.0001" cy="12" r="9.00375" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.44263 12.3392L10.6105 14.5071L10.5965 14.4931L15.4876 9.60205" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};
