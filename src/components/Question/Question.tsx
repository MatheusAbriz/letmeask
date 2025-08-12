import type { ReactNode } from 'react';
import cx from 'classnames';
import '../../styles/question.scss';

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnwsered?: boolean;
    isHighlighted?: boolean;
}

export const Question = ({content, author, children, isAnwsered=false, isHighlighted=false}: QuestionProps) =>{
    return(
        <div className={cx(
            'question',
            {answered: isAnwsered},
            {highlighted: isHighlighted && !isAnwsered}
        )}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={`Imagem do autor ${author.name}`}/>
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    );
};