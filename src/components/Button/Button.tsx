import type { ButtonHTMLAttributes } from "react";
import '../../styles/button.scss';

//Tipando o button props
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
}

//Tudo que não for isOutlined...
export const Button = ({ isOutlined=false, ...props }: ButtonProps) =>{

    return(
        <button 
         className={`button ${isOutlined ? 'outlined' : ''}`} 
         {...props}/>
    )
}