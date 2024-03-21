import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const GameHistoryModal = ({ history, onClose }) => {
  return (
    <div className="modal-background">
        <div className="modal">
            <h2>Historique des Parties</h2>
            <button className="close-btn" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ul>
                {history.map((game, index) => (
                <li key={index} style={{color: game.won ? 'green' : 'red'}}>
                    <p>{game.won ? 'Victoire' : 'Défaite'}</p>

                    <ul>
                        <li>Mot : <span>{game.word}</span></li>
                        <li>Erreurs : <span>{errors}</span></li>
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
