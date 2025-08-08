import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { googleAuthProvider, auth, signInPopup } from '../services/firebase';

//Typando o user
type User = {
    id: string;
    name: string;
    avatar: string;
}

//Tipando o contexto de autenticação
type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

//Tipando o provider do contexto
type AuthContextProviderProps = {
    children: ReactNode
}

//Criando um contexto de autenticacao
export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = (props: AuthContextProviderProps) => {
    const [user, setUser] = useState<User>();

    //Criando um useEffect para verificar se o usuario esta logado
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.');
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        return () => {
            unsubscribe();
        }
    }, []);

    const signInWithGoogle = async () => {
        const provider = googleAuthProvider;
        const result = await signInPopup(auth, provider)

        //Se um usuario for encontrado...
        if (result.user) {
            const { displayName, photoURL, uid } = result.user;

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}

        </AuthContext.Provider>
    );
}