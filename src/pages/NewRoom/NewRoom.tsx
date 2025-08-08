import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';

import { type FormEvent, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.scss';

import { Button } from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';
import { get, ref, set } from 'firebase/database';

export const NewRoom = () => {
    const { user } = useAuth();
    const [ newRoom, setNewRoom ] = useState<string>('');

    //Criando uma sala
    const handleCreateRoom = async(event: FormEvent) =>{
        event.preventDefault();

        //Trim -> remove espaços
        if(newRoom.trim() === '') return;

        //Estruturando os dados da entidade room
        const roomData = {
            title: newRoom,
            authorId: user?.id,
        }

        //Gravando os dados direto no realtime database
        await set(ref(database, 'rooms/'), roomData);

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