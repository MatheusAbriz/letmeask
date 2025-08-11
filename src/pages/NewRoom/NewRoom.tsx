import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';

import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.scss';

import { Button } from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';
import { child, getDatabase, push, ref, set } from 'firebase/database';

export const NewRoom = () => {
    const { user } = useAuth();
    const [ newRoom, setNewRoom ] = useState<string>('');
    const navigate = useNavigate();

    //Criando uma sala
    const handleCreateRoom = async(event: FormEvent) =>{
        event.preventDefault();

        //Trim -> remove espaços
        if(newRoom.trim() === '') return;


        //Criando uma nova key
        const newRoomKey = push(child(ref(database), 'rooms')).key;
        
        //Estruturando os dados da entidade room
        const roomData = {
            roomKey: newRoomKey,
            title: newRoom,
            authorId: user?.id,
        }

        //Gravando os dados direto no realtime database
        const db = getDatabase()
        await set(
            ref(db, 'rooms/' + newRoomKey), roomData
        );
        
        //Navegando para a página junto com o ID da sala
        navigate(`/rooms/${roomData.roomKey}`);
    }

    return (
        <div id="page-auth">
            <aside>
                <img 
                 src={illustrationImg} 
                 alt="Ilustração simbolizando perguntas e respostas"
                />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img 
                     src={logoImg} 
                     alt="logo letmeask"
                    />
                    <h2>Crie uma nova sala</h2>

                    <form onSubmit={handleCreateRoom}>
                        <input 
                         type="text" 
                         placeholder="Nome da sala"
                         onChange={event => setNewRoom(event.target.value)}
                         value={newRoom}
                        />

                        <Button
                         type="submit"
                        >
                         Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique Aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}