import React from 'react';

const Letters = ({ handleLetterPress, attemptedLetters, guessedLetters }) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
        <ul id="letters">
            {alphabet.map((letter) => {
                // Détermine si la lettre a été tentée
                const normalizedLetter = letter.toLowerCase();
                const isAttempted = attemptedLetters.includes(normalizedLetter);
                const isCorrect = guessedLetters.includes(normalizedLetter);
                let className = '';

                if (isAttempted) {
                    className = isCorrect ? 'correct' : 'incorrect';
                }

                return (
                    <li 
                        key={letter} 
                        className={className} // Ajoute 'correct' ou 'incorrect' en fonction de si la lettre est dans guessedLetters
                        onClick={() => handleLetterPress(normalizedLetter)}
                    >
                        {letter}
                    </li>
                );
            })}
        </ul>
    );
}


export default Letters;
