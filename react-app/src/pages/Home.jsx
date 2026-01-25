import GameCard from "../components/GameCard";
import GlitchText from "../components/GlitchText";

const games = [
    { id: 1, title: "Pixel Adventure", thumbnail: "/game1.png" },
    { id: 2, title: "Retro Racer", thumbnail: "/game2.png" },
    { id: 3, title: "Arcade Quest", thumbnail: "/game3.png" },  
];

const Home = () => {
    const gamesWithViews = games.map((game) => ({
        ...game,
        views: parseInt(localStorage.getItem(`views_${game.id}`) || "0"),
    }));

    const sortedGames = [...gamesWithViews].sort(
        (a, b) => b.views - a.views
    );

    return (
        <div className="container">
            <h1>Najpopularniejsze gry</h1>
            <div className="game-list">
                {sortedGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </div>
    );
};

export default Home;
