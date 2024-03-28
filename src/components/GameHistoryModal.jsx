import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const GameHistoryModal = ({ history, onClose }) => {
    // reverse table to have new games on top and not down
    const reversedHistory = [...history].reverse();

  return (
    <div className="modal-background">
        <div className="modal">
            <h2>Historique des Parties</h2>
            <button className="close-btn" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ul>
                {reversedHistory.map((game, index) => (
                <li key={index} style={{color: game.won ? 'green' : 'red'}}>
                    <p>{game.won ? 'Victoire' : 'Défaite'}</p>

                    <ul>
                        <li>Mot : <span>{game.word}</span></li>
                        <li>Erreurs : <span>{game.errors}</span></li> {/* Assurez-vous d'utiliser game.errors ici */}
                        <li>Date : <span>{new Date(game.date).toLocaleDateString()}</span></li>
                    </ul>
                </li>
                ))}
            </ul>
        </div>
    </div>
  );
};

export default GameHistoryModal;
