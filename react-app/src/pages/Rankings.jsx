const rankings = [
    { id: 1, username: "RetroGamer", gamesAdded: 12 },
    { id: 2, username: "PixelKing", gamesAdded: 9 },
    { id: 3, username: "8BitHero", gamesAdded: 7 },
];

const Rankings = () => {
    return (
        <div className="container">
            <h1>Najbardziej aktywni użytkownicy</h1>
            <ul className="ranking-list">
                {rankings.map((user, index) => (
                    <li key={user.id}>
                        {index + 1}. {user.username} – dodane gry: {user.gamesAdded}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Rankings;
