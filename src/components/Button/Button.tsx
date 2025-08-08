import type { ButtonHTMLAttributes } from "react";
import '../../styles/button.scss';

//Tipando o button props
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) =>{

    return(
        <button className="button" {...props}/>
    )
}