import { directions, keys, multiplier } from './constants.js'
import Sokoban from './Sokoban.js'
import {appendToLocalStorage, readFromLocalStorage, setToLocalStorage, updateLocalStorage, justsendtoparent} from './storage.js'

// init
let sokoban
let Attempts = 1
let PageId = ""
export function getAttempts() {
    return Attempts;
}

export function getPageId() {
    return PageId;
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
      justsendtoparent("key_log", `key_log_${PageId}_${Attempts}`, {"game": "soko", "attempt": Attempts, "move": "up",  "t": Date.now()})
      updateLocalStorage("key_count", `key_count_up_${PageId}_${Attempts}`)
      break
    case keys.down:
    case keys.s:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.down)
      justsendtoparent("key_log", `key_log_${PageId}_${Attempts}`, {"game": "soko", "attempt": Attempts, "move": "down",  "t": Date.now()})
      updateLocalStorage("key_count", `key_count_down_${PageId}_${Attempts}`)
      break
    case keys.left:
    case keys.a:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.left)
      justsendtoparent("key_log", `key_log_${PageId}_${Attempts}`, {"game": "soko", "attempt": Attempts, "move": "left",  "t": Date.now()})
      updateLocalStorage("key_count", `key_count_left_${PageId}_${Attempts}`)
      break
    case keys.right:
    case keys.d:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.right)
      justsendtoparent("key_log", `key_log_${PageId}_${Attempts}`, {"game": "soko", "attempt": Attempts, "move": "right",  "t": Date.now()})
      updateLocalStorage("key_count", `key_count_right_${PageId}_${Attempts}`)
      break
    default:
  }

  sokoban.render()
})

document.getElementById('restart').addEventListener('click', (event) => {
  appendToLocalStorage("run_outcome", `run_outcome_${PageId}_${Attempts}`, {"game": "soko", "attempt": Attempts, "res": "reset", "t": Date.now()})
  Attempts += 1
  // setToLocalStorage(`Attempts_${PageId}`, Attempts)
  // clearLocalStorage()
  const canvas = document.getElementById("sokocanvas");
  canvas.focus();
  sokoban.render({ restart: true })
})

document.getElementById('start').addEventListener('click', (event) => {
  const hash = window.location.hash
  console.log(hash)
  PageId = hash.replace('#', '') || "8Ua6YU1D";
  Attempts = 1
  // var prev_attempts = readFromLocalStorage(`Attempts_${PageId}`)
  // if (prev_attempts != null){
  //     Attempts = parseInt(prev_attempts) + 1
  //     setToLocalStorage(`Attempts_${PageId}`, Attempts)
  // }
  // else{
  //     Attempts = 1
  //     setToLocalStorage(`Attempts_${PageId}`, 1)
  // }
  appendToLocalStorage("run_outcome", `run_outcome_${PageId}_${Attempts}`, {"game": "soko", "attempt": Attempts, "res": "start", "t": Date.now()})
  event.target.remove(); // removes the clicked button
  document.getElementById('restart').style.display = 'inline-block';
  document.getElementById('sound').style.display = 'inline-block';
  window.parent.postMessage({ type: "message",  action: "start", id : PageId }, "*");

  fetch(`soko.json`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(jsonData => {
      // Get level number from URL hash, default to 1
        
        const data = jsonData[PageId];

        if (!data) {
            throw new Error(`No data found for id: ${PageId}`);
        }
        const rows = data.split('\n');
        const height = rows.length * multiplier;
        const width = rows[0].length * multiplier;
        sokoban = new Sokoban(data, width, height)
        
        sokoban.render({ restart: true })
    })
    .catch(error => {
        console.log('Error loading level data: ' + error);
    });


})
