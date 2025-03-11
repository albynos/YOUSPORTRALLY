document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const newMatchForm = document.getElementById('new-match-form');
    const matchesList = document.getElementById('matches-list');
    const adminMatchesList = document.getElementById('admin-matches-list');
    const adminSection = document.getElementById('admin-section');
    const loginSection = document.getElementById('login-section');

    const adminPassword = "!4AlbY7!";

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const password = document.getElementById('password').value;
        if (password === adminPassword) {
            loginSection.classList.add('hidden');
            adminSection.classList.remove('hidden');
            displayAdminMatches();
        } else {
            alert('Password errata!');
        }
    });

    newMatchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const date = document.getElementById('match-date').value;
        const time = document.getElementById('match-time').value;
        const duration = parseFloat(document.getElementById('match-duration').value);

        const startTime = new Date(`${date}T${time}:00`);
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
        const endTimeStr = endTime.toTimeString().substring(0, 5);

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = startTime.toLocaleDateString('it-IT', options);
        const startTimeStr = startTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        const fullDateStr = `${dateStr} dalle ${startTimeStr} alle ${endTimeStr}`;

        const newMatch = {
            date: fullDateStr,
            startTime: time,
            endTime: endTimeStr,
            players: [],
            status: 'open'
        };

        db.collection('matches').add(newMatch).then(() => {
            displayMatches();
            displayAdminMatches();
        });
    });

    function displayMatches() {
        matchesList.innerHTML = '';
        db.collection('matches').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const match = doc.data();
                const matchItem = document.createElement('li');
                matchItem.className = `match-item ${match.status}`;
                matchItem.innerHTML = `
                    <div class="info">
                        <div>${match.date}</div>
                        <div class="status ${match.status}">${match.status === 'open' ? 'Aperta' : 'Chiusa'}</div>
                        <div class="remaining-players">Ancora ${4 - match.players.length} giocatori</div>
                    </div>
                    <ul class="players">
                        ${match.players.map(p => `<li>${p.name} ${getEmoticon(p.level)}</li>`).join('')}
                    </ul>
                    <button class="add-player ${match.status === 'closed' ? 'hidden' : ''}">${match.status === 'closed' ? 'Chiuso' : 'Aggiungimi'}</button>
                `;

                if (match.status !== 'closed') {
                    matchItem.querySelector('.add-player').addEventListener('click', () => addPlayerToMatch(doc.id));
                }
                
                matchesList.appendChild(matchItem);
            });
        });
    }

    function displayAdminMatches() {
        adminMatchesList.innerHTML = '';
        db.collection('matches').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const match = doc.data();
                const matchItem = document.createElement('li');
                matchItem.className = `admin-match-item ${match.status}`;
                matchItem.innerHTML = `
                    <div class="info">
                        <div>${match.date}</div>
                        <div class="status ${match.status}">${match.status === 'open' ? 'Aperta' : 'Chiusa'}</div>
                    </div>
                    <ul class="players">
                        ${match.players.map(p => `<li>${p.name} ${getEmoticon(p.level)}</li>`).join('')}
                    </ul>
                    <button class="admin-action edit-match">Modifica</button>
                    <button class="admin-action delete-match">Elimina</button>
                `;

                matchItem.querySelector('.edit-match').addEventListener('click', () => editMatch(doc.id));
                matchItem.querySelector('.delete-match').addEventListener('click', () => deleteMatch(doc.id));
                
                adminMatchesList.appendChild(matchItem);
            });
        });
    }

    function addPlayerToMatch(matchId) {
        const playerName = prompt('Inserisci il tuo nome');
        let playerLevel = prompt('Inserisci il tuo livello (rana, volpe, leone)');

        const player = { name: playerName, level: playerLevel };

        db.collection('matches').doc(matchId).get().then((doc) => {
            const match = doc.data();
            if (match.players.length === 3) {
                match.players.push({ name: 'Graziella', level: 'unicorno' });
            }

            match.players.push(player);

            // Check if match is closed
            if (match.players.length === 4 && !match.players.some(p => p.name === 'Graziella')) {
                match.status = 'closed';
            }

            db.collection('matches').doc(matchId).update(match).then(() => {
                displayMatches();
                displayAdminMatches();
            });
        });
    }

    function editMatch(matchId) {
        // Implementa la logica di modifica della partita
        alert('Funzione di modifica non ancora implementata');
    }

    function deleteMatch(matchId) {
        db.collection('matches').doc(matchId).delete().then(() => {
            displayMatches();
            displayAdminMatches();
        });
    }

    function getEmoticon(level) {
        switch (level) {
            case 'rana':
                return '🐸';
            case 'volpe':
                return '🦊';
            case 'leone':
                return '🦁';
            case 'unicorno':
                return '🦄';
            default:
                return '';
        }
    }

    function clearOldMatches() {
        const today = new Date();
        db.collection('matches').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const match = doc.data();
                if (new Date(match.date.split(' dalle ')[0]) < today) {
                    db.collection('matches').doc(doc.id).delete();
                }
            });
        });
        displayMatches();
        displayAdminMatches();
    }

    clearOldMatches();
    displayMatches();
});
