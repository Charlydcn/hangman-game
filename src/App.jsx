// imports --------------------------------------------------------
import React, { useState, useEffect, useContext } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
// ----------------------------------------------------------------

// components -----------------------------------------------------
import CategorySelect from './components/CategorySelect';
import WordDisplay from './components/WordDisplay';
import Letters from './components/Letters';
import UserErrors from './components/UserErrors';
// ----------------------------------------------------------------

// font awesome ---------------------------------------------------
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// icons ----------------
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
// ----------------------------------------------------------------

// images ---------------------------------------------------------
import happyImg from '../public/img/happy.png'
import sadImg from '../public/img/sad.png'
// ----------------------------------------------------------------

// stylesheets ----------------------------------------------------
import './App.css';
import Arrow from './components/Arrow';
// ----------------------------------------------------------------


function App() {
    // is like a counter that we increment to call API
    // (triggerKey is in the dependencies of the API Call useEffect() if this useEffect() will be executed every time that it changes value)
    const [triggerKey, setTriggerKey] = useState(0);
    // if the game is running or not (boolean)
    const [gameRunning, setGameRunning] = useState(false);
    // if the game is won or not (boolean)
    const [gameWon, setGameWon] = useState(false);
    // id of the chosen category (int)
    const [categoryId, setCategoryId] = useState(0);
    const [category, setCategory] = useState(null);
    // current word generated (string)
    const [word, setWord] = useState(null);
    // letters that user tried to guess (all of them, right ones and wrong ones) (array)
    const [attemptedLetters, setAttemptedLetters] = useState([])
    // letters that user guessed right (array)
    const [guessedLetters, setGuessedLetters] = useState([])
    // errors (int)
    const [errors, setErrors] = useState(0)
    // confetti hook
    const [isExploding, setIsExploding] = React.useState(false);
    // show modal (boolean)
    const [showModal, setShowModal] = useState(false);
    // game history (JSON/local storage)
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

    const showModalButton = gameHistory.length > 0

    // API base URL
    const API_URL = "https://trouve-mot.fr/api";



    // ---------------------------------------------------------------------------------------------------------------------------------
    // Dynamic API Call ----------------------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (gameRunning) {
            const call = categoryId > 0 ? `categorie/${categoryId}` : 'random';

            fetch(`${API_URL}/${call}`)
                .then(response => response.json())
                .then(json => {
                    setWord(json[0].name);
                    setCategory(json[0].categorie);
                })
                .catch(error => console.error(error));
        }
    }, [triggerKey, ]);
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // console.log to check whenever game is started or stopped ------------------------------------------------------------------------

    useEffect(() => {
        if (gameRunning) {
            console.log('🎮🎮🎮 Game is running 🎮🎮🎮');
        } else {
            console.log('🛑🛑🛑 Game is not running 🛑🛑🛑');
        }
    }, [gameRunning]);
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // useEffect everytime guessedLetters changes (guessedLetters = array of correct letters guessed by user) --------------------------

    useEffect(() => {
        if (!word) return;

        console.log('Guessed letters : ', guessedLetters)
        console.log(`Word to guess : ${word} (${category})`)


        // get current word to guess in a array and normalize every letters ('Étoile' => '['e', 't', 'o', 'i', 'l', 'e'])
        const normalizedWordLetters = word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split('');

        // for each letter in normalizedwordletters array, check if it is in guessedletters array
        // if every iteration of the 'every()' function is true, it returns 'true'; otherwise, it returns 'false'
        // so, isWordGuessed checks if the user has guessed all letters in the word to guess
        const isWordGuessed = normalizedWordLetters.every(letter => guessedLetters.includes(letter));

        if (isWordGuessed) {
            console.log('🤩🤩🤩 YOU WON !!! 🤩🤩🤩')
            setGameWon(true);
            endGame(true); // endGame(true) to win the game
        }
    }, [guessedLetters])
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // everytime a word changes, create new newGuessedLettersarray, empty AttemptedLetters array, set Errors to 0 ----------------------

    useEffect(() => {
        // if a word is defined
        if (word) {
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
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    const startGame = () => {
        // reset word, letters arrays, errors, gameWon, confettis API 'isExploding'
        setWord(null);
        setAttemptedLetters([]);
        setGuessedLetters([]);
        setErrors(0);
        setGameWon(false);
        setIsExploding(false);

        // start game, generate word
        setGameRunning(true);
        generateWord();
    }
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // endgame fonction, if victory is true, win game, otherwise, loose game -----------------------------------------------------------
    const endGame = (victory) => {
        setGameRunning(false);
        setGameWon(victory);

        console.log(guessedLetters, `(${guessedLetters.length})`);
        console.log(word, `(${word.length})`);

        updateGameHistory(word, victory, errors);

        if(victory) {
            console.log('You won ! 👍👍');
            setIsExploding(true);
        } else {
            console.log('Game over.. 😒');
            setIsExploding(false);
        }
    }
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // handle category change ----------------------------------------------------------------------------------------------------------
    const handleCategoryChange = (newCategoryId, newCategoryName) => {
        setCategoryId(newCategoryId);
        setCategory(newCategoryName);
    }
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // generate word by incrementing triggerKey by 1 -----------------------------------------------------------------------------------
    const generateWord = () => {
        setTriggerKey(triggerKey + 1);
    }
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // handle letter press (keyboard or mouse) -----------------------------------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // handle correct letter guessed ---------------------------------------------------------------------------------------------------
    const handleLetterGuessed = (letter) => {
        const normalizedLetter = normalizeLetter(letter);

        // if letter pressed isn't already in guessedLetters array
        if (!guessedLetters.includes(normalizedLetter)) {
            // add new letter in guessedLetters array
            setGuessedLetters((prevGuessedLetters) => [...prevGuessedLetters, normalizedLetter]);

        }
    };
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // function to check if a letter is in the word to guess ---------------------------------------------------------------------------
    const isInWord = (letter) => {
        const wordLetters = word.split('');
        return wordLetters.some((wordLetter) => normalizeLetter(wordLetter) === normalizeLetter(letter));
    }
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // normalize letter function (example: normalizeLetter('É') = 'e') -----------------------------------------------------------------
    const normalizeLetter = (letter) => letter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // ---------------------------------------------------------------------------------------------------------------------------------


    
    // ---------------------------------------------------------------------------------------------------------------------------------
    // handle key press ----------------------------------------------------------------------------------------------------------------
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

        window.addEventListener('keydown', handleKeyPress);

        return () => {
        window.removeEventListener('keydown', handleKeyPress);
        };
    }, [gameRunning, handleLetterPress]);
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // update game history function ----------------------------------------------------------------------------------------------------
    function updateGameHistory(word, won, errors) {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
      
        const newGameRecord = {
          word,
          won,
          date: new Date().toISOString(),
          errors
        };
      
        gameHistory.push(newGameRecord);
        localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
    }   
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // clear game history function -----------------------------------------------------------------------------------------------------
    const clearGameHistory = () => {
        // Demande de confirmation
        const isConfirmed = window.confirm("Vider l'historique des parties ?");
        
        if (isConfirmed) {
          localStorage.removeItem('gameHistory');
          setShowModal(false);
        }
    };
    // ---------------------------------------------------------------------------------------------------------------------------------
      


    // ---------------------------------------------------------------------------------------------------------------------------------
    function renderGameHistory() {
		const gameHistory =
			JSON.parse(localStorage.getItem("gameHistory")) || [];

		// Calcul des statistiques
		const stats = calculateStats();

		// Vérifie si l'historique est vide et affiche un message approprié
		if (gameHistory.length === 0) {
			return <h5>Pas encore de parties dans l'historique.</h5>;
		}

		return (
			<>
				<div className="game-stats">
					<p>Taux de victoire : {stats.winRate}% ({stats.totalWins} victoires - {stats.totalLosses} défaites)</p>
					<p>Parties jouées : {stats.totalGames}</p>
					<p>Erreurs : {stats.totalErrors}</p>
				</div>
				{gameHistory.map((game, index) => (
					<div
						key={index}
						className={`modal-history-entry ${
							game.won ? "win" : "lose"
						}`}
					>
						<p>Mot : {game.word}</p>
						<p>Résultat : {game.won ? "Gagné" : "Perdu"}</p>
						<p>Date : {new Date(game.date).toLocaleString()}</p>
						<p>Erreurs : {game.errors}</p>
					</div>
				))}
			</>
		);
	}
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // display modal function ----------------------------------------------------------------------------------------------------------
    const toggleModal = () => setShowModal(!showModal);
    // ---------------------------------------------------------------------------------------------------------------------------------



    // ---------------------------------------------------------------------------------------------------------------------------------
    // get stats for match history -----------------------------------------------------------------------------------------------------
    function calculateStats() {
        const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        const totalGames = gameHistory.length;
        const totalWins = gameHistory.filter(game => game.won).length;
        const totalLosses = totalGames - totalWins;
        const totalErrors = gameHistory.reduce((acc, game) => acc + game.errors, 0);
        const winRate = totalWins / totalGames * 100 || 0;
    
        return {
            totalGames,
            totalWins,
            totalLosses,
            totalErrors,
            winRate: winRate.toFixed(2) // Arrondi à deux chiffres après la virgule
        };
    }
    // ---------------------------------------------------------------------------------------------------------------------------------
    const triggerConfettiExplosion = () => {
        if(isExploding) return; 
        setIsExploding(true);

        setTimeout(() => {
            setIsExploding(false);
        }, 2000);
    };


    // ----------------------------------------------------------------------------------------------------------------------------------
    //                                                              APP                                                                             
    // ----------------------------------------------------------------------------------------------------------------------------------

return (
    <>
        <main>
            <h1>Hangman game</h1>
    
            <div id="menu">
                <CategorySelect onCategoryChange={handleCategoryChange} />
                <button onClick={startGame}>
                    <FontAwesomeIcon icon={faPlay} />
                </button>
            </div>

            <div
                id="game"
                style={
                    {
                        backgroundColor: !gameRunning ? 'var(--violet1)' : '',
                    }
                }>
            {
                // ---------------------------------------------------------------------------------------
                // game is running --------------------------------------------------------------------
                gameRunning ? (
                    <>
                        <UserErrors errors={errors} endGame={endGame} category={category}/> 

                        <div>
                            <WordDisplay
                                word={word}
                                normalizeLetter={normalizeLetter}
                                guessedLetters={guessedLetters.map(letter => normalizeLetter(letter))}/>
                        </div>

                        <Letters
                            handleLetterPress={handleLetterPress}
                            attemptedLetters={attemptedLetters}
                            guessedLetters={guessedLetters}/>
                    </>

                // -------------------------------------------------------------------------------------------


                // -------------------------------------------------------------------------------------------
                // WIN - game is not running & the game is won -----------------------------------------------
                ) : gameWon ? (
                    <>
                        <img className="endgame-img victory" src={happyImg} alt="" />
                        <div className="endgame-container">
                            <h3>Bravo ! Vous avez gagné ! <span onClick={triggerConfettiExplosion}>🎉</span></h3>
                            <button onClick={startGame}>Rejouer</button>
                        </div>
                        {isExploding && <ConfettiExplosion />}
                    </>
                // ---------------------------------------------------------------------------------------


                // -------------------------------------------------------------------------------------------
                // game is not running  -------------------------------------------------------------------
                ) : ( !word ? ( 
                        <>
                            <Arrow color="#62466b" />
                            <h2>
                                Sélectionnez une catégorie et générez un mot ! 
                                <FontAwesomeIcon icon={faThumbsUp} />
                            </h2>
                        </>


                // -------------------------------------------------------------------------------------------
                // LOOSE -  word is defined but game is not won (loose) --------------------------------------
                        
                    ) : (
                        <>
                            <img className="endgame-img" src={sadImg} alt="" />

                            <div className="endgame-container">
                                <h3>Dommage ! Vous avez perdu...</h3>
                                <p>Le mot à deviner était : <span className='word-to-guess'>{word}</span> ({category})</p>

                                <button onClick={startGame}>Rejouer</button>
                            </div>
                        </>
                    )
                // -------------------------------------------------------------------------------------------

                )
                // -------------------------------------------------------------------------------------------
            }

            <>
                {
                    showModalButton && (
                        <button id="game-history-btn" onClick={toggleModal}>
                            <FontAwesomeIcon icon={faClockRotateLeft} />
                        </button>
                    )
                }

                {
                    showModal && (
                    <div id="modal-overlay" className={showModal ? "show" : ""} onClick={toggleModal}>
                        <div id="modal-content" onClick={e => e.stopPropagation()}>
                            <span id="modal-close" onClick={toggleModal}>&times;</span>
                            <h4>Historique des Parties</h4>
                            <div id="modal-body">
                                {renderGameHistory()}
                            </div>
                            <button onClick={clearGameHistory}>Vider l'historique</button>
                        </div>
                    </div>
                    )
                }

            </>

            </div>
    
        </main>
    </>
);

    // ----------------------------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------------------------------
    
}

export default App;
