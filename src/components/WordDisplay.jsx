import Letters from "./Letters";

const WordDisplay = ({ word, normalizeLetter, guessedLetters }) => {
    if(!word) return null;
        
    const wordLetters = word.split('');
    
    return (
        <ul id="word">
          {
            wordLetters.map((letter, index) => {
                const normalizedLetter = normalizeLetter(letter);

                const letterToShow = 
                    guessedLetters.includes(normalizedLetter) || normalizeLetter(wordLetters[0]) === normalizedLetter
                    ? (index === 0 ? letter.toUpperCase() : letter)
                    : "";

                return <li key={index}>{letterToShow}</li>;
            })
          }
        </ul>
    );
};


export default WordDisplay;
