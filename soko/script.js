import { directions, keys, multiplier } from './constants.js'
import Sokoban from './Sokoban.js'
import {appendToLocalStorage, readFromLocalStorage, setToLocalStorage} from './storage.js'

// init

// Get level number from URL hash, default to 1
const hash = window.location.hash
const pageId = hash.replace('#', '')

let sokoban
let Attempts = 0

export function getAttempts() {
    return Attempts;
}

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
            Attempts = prev_attempts + 1
        }
        else{
            Attempts = 1
            setToLocalStorage("Attempts", 1)
        }
        appendToLocalStorage("run_outcome", {"game": "soko", "attempt": Attempts, "res": "start", "t": Date.now()})
        sokoban.render({ restart: true })
        // var canv = document.querySelector('canvas')
        // var imageDataURL = canv.toDataURL("image/png");
        // var link = document.createElement("a");
        // link.href = imageDataURL;
        // link.download = `${pageId}.png`;
        // link.click();
    })
    .catch(error => {
        console.log('Error loading level data: ' + error);
    });


// re-render
document.addEventListener('keydown', (event) => {
  const playerCoords = sokoban.findPlayerCoords()

  switch (event.key) {
    case keys.up:
    case keys.w:
      sokoban.move(playerCoords, directions.up)
      appendToLocalStorage("key_log", {"game": "soko", "attempt": Attempts, "move": "up",  "t": Date.now()})
      break
    case keys.down:
    case keys.s:
      sokoban.move(playerCoords, directions.down)
      appendToLocalStorage("key_log", {"game": "soko", "attempt": Attempts, "move": "down",  "t": Date.now()})
      break
    case keys.left:
    case keys.a:
      sokoban.move(playerCoords, directions.left)
      appendToLocalStorage("key_log", {"game": "soko", "attempt": Attempts, "move": "left",  "t": Date.now()})
      break
    case keys.right:
    case keys.d:
      sokoban.move(playerCoords, directions.right)
      appendToLocalStorage("key_log", {"game": "soko", "attempt": Attempts, "move": "right",  "t": Date.now()})
      break
    default:
  }

  sokoban.render()
})

document.querySelector('button').addEventListener('click', (event) => {
  appendToLocalStorage("run_outcome", {"game": "soko", "attempt": Attempts, "res": "reset", "t": Date.now()})
  sokoban.render({ restart: true })
})
