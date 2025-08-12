import { useNavigate, useParams } from "react-router-dom";

import logoImg from "../../assets/images/logo.svg";
import deleteImg from "../../assets/images/delete.svg";
import checkImg from "../../assets/images/check.svg";
import answerImg from "../../assets/images/answer.svg";
import { Button } from "../../components/Button/Button";
import { RoomCode } from "../../components/RoomCode/RoomCode";
import "../../styles/room.scss";
//import { useAuth } from "../../hooks/useAuth";
import { Question } from "../../components/Question/Question";
import { useRoom } from "../../hooks/useRoom";
import { ref, remove, update } from "firebase/database";
import { database } from "../../services/firebase";

//Tipando os parametros da rota
type RoomParams = {
  id: string;
};
export const AdminRoom = () => {
  //const { user } = useAuth();
  const params = useParams<RoomParams>();
  const { questions, title } = useRoom(params.id);
  const navigate = useNavigate();

  const handleEndRoom = async() =>{
    await update(
      ref(database, `rooms/${params.id}`),
      {
        endedAt: new Date()
      }
    )

    navigate('/');
  }

  const handleCheckQuestionAsAnswered = async(questionId: string) => {
    await update(
      ref(database, `rooms/${params.id}/questions/${questionId}`),
      {
        isAnswered: true
      }
    )
  }

  const handleHighlightQuestion = async(questionId: string) => {
    await update(
      ref(database, `rooms/${params.id}/questions/${questionId}`),
      {
        isHighlighted: true
      }
    )
  }

  const handleDeleteQuestion = async(questionId: string) => {
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
      await remove(
        ref(database, `rooms/${params.id}/questions/${questionId}`)
      )
    }

  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="imagem logo let me ask" />
          <div>
            <RoomCode code={params.id} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
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
              isAnwsered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >

              {!question.isAnswered && (<>
                <button
                 type="button"
                 onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Marcar pergunta como respondida"/>
                </button>

                <button
                 type="button"
                 onClick={() => handleHighlightQuestion(question.id)}
                >
                  <img src={answerImg} alt="Dar destaque a pergunta"/>
                </button>
                </>)}

                <button
                 type="button"
                 onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta"/>
                </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
};
