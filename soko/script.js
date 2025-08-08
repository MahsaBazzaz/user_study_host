import { directions, keys, multiplier } from './constants.js'
import Sokoban from './Sokoban.js'
import {appendToLocalStorage, readFromLocalStorage, setToLocalStorage, clearLocalStorage} from './storage.js'

// init

// Get level number from URL hash, default to 1
const hash = window.location.hash
const pageId = hash.replace('#', '') || "8Ua6YU1D";

let sokoban
let Attempts = 0

export function getAttempts() {
    return Attempts;
}




// re-render
document.addEventListener('keydown', (event) => {
  const playerCoords = sokoban.findPlayerCoords()

  switch (event.key) {
    case keys.up:
    case keys.w:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.up)
      appendToLocalStorage("key_log", {"game": "soko", "attempt": Attempts, "move": "up",  "t": Date.now()})
      break
    case keys.down:
    case keys.s:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.down)
      appendToLocalStorage("key_log", {"game": "soko", "attempt": Attempts, "move": "down",  "t": Date.now()})
      break
    case keys.left:
    case keys.a:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.left)
      appendToLocalStorage("key_log", {"game": "soko", "attempt": Attempts, "move": "left",  "t": Date.now()})
      break
    case keys.right:
    case keys.d:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.right)
      appendToLocalStorage("key_log", {"game": "soko", "attempt": Attempts, "move": "right",  "t": Date.now()})
      break
    default:
  }

  sokoban.render()
})

document.getElementById('restart').addEventListener('click', (event) => {
  appendToLocalStorage("run_outcome", {"game": "soko", "attempt": Attempts, "res": "reset", "t": Date.now()})
  Attempts += 1
  setToLocalStorage("Attempts", Attempts)
  // clearLocalStorage()
  sokoban.render({ restart: true })
})

document.getElementById('start').addEventListener('click', (event) => {
  fetch(`soko.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(jsonData => {
        const data = jsonData[pageId];

        if (!data) {
            throw new Error(`No data found for id: ${pageId}`);
        }
        const rows = data.split('\n');
        const height = rows.length * multiplier;
        const width = rows[0].length * multiplier;
        sokoban = new Sokoban(data, width, height)
        var prev_attempts = readFromLocalStorage("Attempts")
        if (prev_attempts != null){
            Attempts = parseInt(prev_attempts) + 1
            setToLocalStorage("Attempts", Attempts)
        }
        else{
            Attempts = 1
            setToLocalStorage("Attempts", 1)
        }
        appendToLocalStorage("run_outcome", {"game": "soko", "attempt": Attempts, "res": "start", "t": Date.now()})
        event.target.remove(); // removes the clicked button
        document.getElementById('restart').style.display = 'block';
        sokoban.render({ restart: true })
    })
    .catch(error => {
        console.log('Error loading level data: ' + error);
    });


})
