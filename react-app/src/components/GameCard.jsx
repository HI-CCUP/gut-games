import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
    return (
        <div className="game-card">
            <img src={game.thumbnail} alt={game.title} />
            <h3>{game.title}</h3>
            <p>Odwiedzenia: {game.views}</p>

            <Link to={`/game/${game.id}`} className="play-button">
                Graj
            </Link>
        </div>
    );
};

export default GameCard;
