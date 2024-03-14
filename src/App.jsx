import React, { useState, useEffect } from 'react';
import CategorySelect from './components/CategorySelect';
import WordDisplay from './components/WordDisplay';
import Letters from './components/Letters';

import './App.css';

function App() {
    const [gameRunning, setGameRunning] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [categoryId, setCategoryId] = useState(0);
    const [word, setWord] = useState(null);
    const [attemptedLetters, setAttemptedLetters] = useState([])
    const [guessedLetters, setGuessedLetters] = useState([])
    const [errors, setErrors] = useState(0)

    // is like a counter that we increment to call API
    // (triggerKey is in the dependencies of the API Call useEffect() if this useEffect() will be executed every time that it changes value)
    const [triggerKey, setTriggerKey] = useState(0);

    const API_URL = "https://trouve-mot.fr/api";

    // Dynamic API Call
    useEffect(() => {
        if (gameRunning) {
            const call = categoryId > 0 ? `categorie/${categoryId}` : 'random';

            fetch(`${API_URL}/${call}`)
                .then(response => response.json())
                .then(json => {
                    setWord(json[0].name);
                })
                .catch(error => console.error(error));
        }
    }, [triggerKey]);

    // console.log to check whenever game is started or stopped
    useEffect(() => {
        if (gameRunning) {
            console.log('Game is running');
        } else {
            console.log('Game is not running');
        }
    }, [gameRunning]);

    // error handling
    useEffect(() => {
        console.log(`Errors : ${errors}`)

        if (errors >= 7) {
            endGame(false)
        }
    
        // if(!gameWon) {
        //     errorImg.src = `../public/img/hang-${errors}.png`
        // }
    }, [errors]);

    useEffect(() => {
        console.log('Guessed letters : ', guessedLetters)
        console.log('Word to guess : ', word)

        if (!word) return;

        const normalizedWordLetters = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split('');

        const isWordGuessed = normalizedWordLetters.every(letter => guessedLetters.includes(letter));

        if (isWordGuessed) {
            console.log('🤩🤩🤩 YOU WON !!! 🤩🤩🤩')
            setGameWon(true);
            endGame(true); // Appeler endGame avec true pour indiquer une victoire
        }
    }, [guessedLetters])

    // everytime a word changes, create new newGuessedLettersarray, empty AttemptedLetters array, set Errors to 0
    useEffect(() => {
        // if a word is defined
        if (word) {
            console.log(word);
            
            // normalize first letter of the word
            const firstLetterNormalized = normalizeLetter(word[0]);

            // create new array of guessed letters and add the word's first letter and all occurence of it in the word
            const newGuessedLetters = [
                firstLetterNormalized, // add first letter (bc it's given by default)
                ...word
                    .split('') // word : string to array 
                    .filter((letter, index) => index !== 0) // remove first letter bc we added it before
                    .filter((letter) => normalizeLetter(letter) === firstLetterNormalized) // remove letters that are the same as the first one
                    .map(normalizeLetter) // normalize all letters
                    .filter((letter, index, self) => self.indexOf(letter) === index) // remove identic letters
            ];

            // set new guessedLetters array
            setGuessedLetters(newGuessedLetters);
        }

        // everytime word changes, empty attemptedLetters and set errors to 0
        setAttemptedLetters([]);
        setErrors(0);

    }, [word]); 


    const startGame = () => {
        setWord(null);
        setGameWon(false);
        setGameRunning(true);
        generateWord();
    }

    const endGame = (victory) => {
        setGameRunning(false);

        console.log(guessedLetters, `(${guessedLetters.length})`);
        console.log(word, `(${word.length})`);

        if(victory) {
            console.log('You won ! 👍👍');
        } else {
            console.log('Game over.. 😒');
        }
    }

    // handle category change
    const handleCategoryChange = (newCategoryId) => {
        setCategoryId(newCategoryId);
    }

    // generate word by incrementing triggerKey by 1
    const generateWord = () => {
        setTriggerKey(triggerKey + 1);
    }

    // handle letter press (keyboard or mouse)
    const handleLetterPress = (letter) => {
        // if the game is running
        if(gameRunning) {
            console.log('--------- Word to guess : ', word, ' --------------------');
            console.log('Letter : ', letter);

            // add letter to letters attempted
            setAttemptedLetters([...attemptedLetters, normalizeLetter(letter)]);

            // if user already tried this letter
            if(attemptedLetters.includes(normalizeLetter(letter))) {
                console.log('⚠️⚠️⚠️ - You already tried this letter - ⚠️⚠️⚠️');
                return;
            }

            // is the letter is in the word to guess
            if(isInWord(letter)) {
                console.log('😎 - Correct ! - 😎');
                handleLetterGuessed(letter);
                if(guessedLetters.length >= word.length) {
                    endGame(true);
                }
            // else, error
            } else {
                console.log('😓 - Wrong.. - 😓');
                setErrors(errors + 1)
            }
        } else {
            console.log('Game is not running !');
        }
    }

    // handle correct letter guessed
    const handleLetterGuessed = (letter) => {
        const normalizedLetter = normalizeLetter(letter);

        if (!guessedLetters.includes(normalizedLetter)) {
            setGuessedLetters((prevGuessedLetters) => [...prevGuessedLetters, normalizedLetter]);
        }
    };

    const isInWord = (letter) => {
        const wordLetters = word.split('');
        return wordLetters.some((wordLetter) => normalizeLetter(wordLetter) === normalizeLetter(letter));
    }

    // normalize letter function (example: normalizeLetter('É') = 'e')
    const normalizeLetter = (letter) => letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    
    // handle key press
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!gameRunning) {
                console.log('Game is not running !');
                return;
            }

            if (e.key.match(/^[a-z]$/i)) {
                handleLetterPress(e.key);
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyPress);

        // Remove event listener
        return () => {
        window.removeEventListener('keydown', handleKeyPress);
        };
    }, [gameRunning, handleLetterPress]); // Add `gameRunning` and `handleLetterPress` as dependencies

    return (
        <>
            <h1>Hangman game</h1>
    
            <div id="menu">
                <CategorySelect onCategoryChange={handleCategoryChange} />
                <button onClick={startGame}>Générer</button>
            </div>
    
            {
                gameRunning && word
                ? (
                    <>
                        <WordDisplay
                            word={word}
                            normalizeLetter={normalizeLetter}
                            guessedLetters={guessedLetters.map(letter => normalizeLetter(letter))}/>
                        <Letters handleLetterPress={handleLetterPress}/>
                    </>
                )
                : null
            }
        </>
    );
    
}

export default App;
