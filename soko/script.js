import { directions, keys, multiplier } from './constants.js'
import Sokoban from './Sokoban.js'
import {getTargetsLeft} from './Sokoban.js'
import {justsendtoparent} from './storage.js'

// init
let sokoban
let Attempts = 1
let Count_up = 0
let Count_down = 0
let Count_right = 0
let Count_left = 0
let PageId = ""
export function getAttempts() {
    return Attempts;
}

export function getPageId() {
    return PageId;
}

export function getCount_up() {
    return PageId;
}

export function getCount_down() {
    return PageId;
}

export function getCount_right() {
    return PageId;
}

export function getCount_left() {
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
      Count_up += 1
      break
    case keys.down:
    case keys.s:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.down)
      Count_down +=1
      break
    case keys.left:
    case keys.a:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.left)
      Count_left += 1
      break
    case keys.right:
    case keys.d:
      event.preventDefault();
      event.stopPropagation();
      sokoban.move(playerCoords, directions.right)
      Count_right += 1
      break
    default:
  }

  sokoban.render()
})

document.getElementById('restart').addEventListener('click', (event) => {
  let outcome_obj = {
                "game": "soko",
                "id": PageId,
                "attempt": Attempts,
                "t": Date.now(),
                "res" : "reset",
                "right_key": Count_right,
                "left_key": Count_left,
                "down_key": Count_down,
                "up_key": Count_up,
                "targets_left" : getTargetsLeft()
  }
  justsendtoparent(`log_${PageId}_${Attempts}`, outcome_obj)
  // console.log(outcome_obj)
  Attempts += 1
  const canvas = document.getElementById("sokocanvas");
  canvas.focus();
  sokoban.render({ restart: true })
})

document.getElementById('start').addEventListener('click', (event) => {
  const hash = window.location.hash
  // console.log(hash)
  PageId = hash.replace('#', '') || "8Ua6YU1D";
  Attempts = 1
  window.addEventListener("message", (event) => {
      if (event.data.type === "command") {
          console.log("Received command:", event.data.action);
          let outcome_obj = {
                "game": "soko",
                "id": PageId,
                "attempt": Attempts,
                "t": Date.now(),
                "res" : "lastlog",
                "right_key": Count_right,
                "left_key": Count_left,
                "down_key": Count_down,
                "up_key": Count_up,
                "targets_left" : getTargetsLeft()
          }
          justsendtoparent(`log_${PageId}_${Attempts}`, outcome_obj)
      }
  });

  let outcome_obj = {
                "game": "soko",
                "id": PageId,
                "attempt": Attempts,
                "t": Date.now(),
                "res" : "start",
                "right_key": Count_right,
                "left_key": Count_left,
                "down_key": Count_down,
                "up_key": Count_up,
                "targets_left" : getTargetsLeft()
  }
  justsendtoparent(`log_${PageId}_${Attempts}`, outcome_obj)
  // console.log(outcome_obj)
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
