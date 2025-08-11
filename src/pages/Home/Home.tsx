import { useNavigate } from 'react-router-dom';
import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';
import '../../styles/auth.scss';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../hooks/useAuth';
import { type FormEvent, useState } from 'react';
import { ref, get, child } from 'firebase/database';
import { database } from '../../services/firebase';

export const Home = () => {
    const navigate = useNavigate();
    //Importando o contexto
    const { user, signInWithGoogle } = useAuth();
    const [ roomCode, setRoomCode ] = useState('');

    const handleCreateRoom = async() =>{
        //Se user não existir, logar. Caso contrário, redirecionar para as salas
        if(!user){
            await signInWithGoogle();
        }

        navigate('/rooms/new');
    }

    const handleJoinRoom = async(event: FormEvent) =>{
        event.preventDefault();

        if(roomCode.trim() === '') return;

        //Verificando se a sala existe
        await get(child(ref(database, 'rooms'), roomCode)).then((snapshot) =>{
            if(!snapshot.exists()){
                alert('Sala inexistente');
                return;
            }

            navigate(`/rooms/${roomCode}`);
        });
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
                    
                    <button 
                     onClick={handleCreateRoom}
                     className='create-room'
                    >
                        <img 
                         src={googleIconImg} 
                         alt="imagem logo google"
                        />

                        Crie sua sala com o Google
                    </button>

                    <div className="separator">Ou entre em uma sala</div>
                    <form action="" onSubmit={handleJoinRoom}>
                        <input 
                         type="text" 
                         placeholder="Digite o código da sala"
                         onChange={event => setRoomCode(event.target.value)}
                         value={roomCode}
                        />

                        <Button
                         type="submit"
                        >
                         Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}