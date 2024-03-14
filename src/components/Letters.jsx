import React from 'react';

const Letters = ({ handleLetterPress }) => {
    const alphabet = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    

    return (
        <ul id="letters">
          {
            alphabet.map((letter, index) => (
                <li key={index} onClick={() => handleLetterPress(letter)}>
                    {letter}
                </li>
            ))
          }
        </ul>
    )    
}

export default Letters;
