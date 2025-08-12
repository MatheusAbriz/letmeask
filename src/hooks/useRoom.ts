import { useEffect, useState } from "react";
import { off, onValue, ref } from "firebase/database";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;

    //Likes é um objeto com a key em string e com o authorId como string
    likes: Record<string, {
      authorId: string;
    }>
  }
>;

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};
export const useRoom = (roomId: string | undefined) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

   onValue(roomRef, (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
            //Caso nao tenha likes, vem vazio
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });

    return () =>{
      off(roomRef);
    }
  }, [roomId, user?.id]);

  return { questions, title };
};
