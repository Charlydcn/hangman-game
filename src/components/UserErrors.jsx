import React, { useEffect } from "react";
import CategoryTooltip from "./CategoryTooltip";

import hangmanImage0 from "/public/img/hang-0.png";
import hangmanImage1 from "/public/img/hang-1.png";
import hangmanImage2 from "/public/img/hang-2.png";
import hangmanImage3 from "/public/img/hang-3.png";
import hangmanImage4 from "/public/img/hang-4.png";
import hangmanImage5 from "/public/img/hang-5.png";
import hangmanImage6 from "/public/img/hang-6.png";
import hangmanImage7 from "/public/img/hang-7.png";

const UserErrors = ({ errors, endGame, category }) => {
    useEffect(() => {
        console.log(`Errors : ${errors}`);

        if (errors >= 7) {
            endGame(false);
        }
    }, [errors]);

    const hangmanImages = [
        hangmanImage0, hangmanImage1, hangmanImage2, hangmanImage3, 
        hangmanImage4, hangmanImage5, hangmanImage6, hangmanImage7
    ];

    const currentImage = hangmanImages[errors];

    return (
        <figure id="error-container">
            <img src={currentImage} alt={`Error image of a hangman with ${errors} errors`} />
            <figcaption>{errors} erreur(s)</figcaption>

            <CategoryTooltip category={category} />
        </figure>
    );
};

export default UserErrors;
