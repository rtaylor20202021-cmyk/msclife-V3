let fame = 0, money = 100, skill = 50;
let songs = [];
let albums = [];

const platforms = {
  spotify: { fame: 1.5, money: 2 },
  youtube: { fame: 2, money: 1 },
  tiktok: { fame: 1, money: 3 }
};

const out = document.getElementById('output');

/**
 * Fame Level Thresholds - Version 3
 */
function getFameLevel() {
  if (fame >= 100000) return "👑 Global Legend";
  if (fame >= 50000)  return "🌟 Superstar";
  if (fame >= 35000)  return "🎤 Mainstream Artist";
  if (fame >= 25000)  return "📈 Rising Star";
  if (fame >= 5500)   return "🎸 Local Hero";
  if (fame >= 500)    return "🎧 Indie Artist";
  return "🏠 Bedroom Producer";
}

function print(txt) {
  out.innerHTML += txt + '<br>';
  out.scrollTop = out.scrollHeight;
}

function updateStatus() {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.innerHTML = `
      <span>[${getFameLevel()}]</span>
      <span>FAME: ${fame}</span> 
      <span>CASH: $${money}</span> 
      <span>SKILL: ${skill}</span> 
      <span>SONGS: ${songs.length}</span> 
      <span>ALBUMS: ${albums.length}</span>
    `;
  }
}

function collectRoyalties() {
  let totalEarnings = 0;
  songs.forEach(s => {
    if (s.released) {
      let royalty = Math.floor((s.quality / 5) + (fame / 100));
      totalEarnings += royalty;
    }
  });
  if (totalEarnings > 0) {
    money += totalEarnings;
    print(`<span style="color: #ffd600;">Passive Income: $${totalEarnings} collected from streams.</span>`);
  }
}

function createSong() {
  let name = prompt("Song name:");
  if (!name) return;
  let quality = Math.floor(Math.random() * 10) + Math.floor(skill / 10);
  songs.push({ name, quality, released: false });
  fame += Math.floor(quality / 2);
  print(`<b>New Track:</b> '${name}' (Quality: ${quality})`);
  collectRoyalties(); 
  updateStatus();
}

function practice() {
  if (money < 20) {
    print("<span style='color:red;'>Insufficient funds.</span>");
    return;
  }
  money -= 20;
  skill += 5;
  print(`Practice complete. Skill increased to ${skill}.`);
  updateStatus();
}

function perform() {
  if (Math.random() > 0.3) {
    let gain = Math.floor(Math.random() * 20) + 10;
    fame += gain; money += (gain * 2);
    print(`Successful performance! +${gain} Fame, +$${gain * 2} Cash.`);
    collectRoyalties(); 
  } else print("<span style='color:orange;'>The venue was empty. No money made.</span>");
  updateStatus();
}

function showSongs() {
  out.innerHTML = '';
  if (albums.length > 0) {
    print("<b>--- ALBUMS ---</b>");
    albums.forEach((alb, i) => {
      print(`${i + 1}. ${alb.name} | Quality: ${alb.quality.toFixed(1)} | Tracks: ${alb.songs.length}`);
    });
    print("");
  }
  if (songs.length === 0) { print("No music recorded yet."); return; }
  print("<b>--- SINGLES ---</b>");
  songs.forEach((s, i) => {
    let status = s.released ? `<span style="color:#00ff88;">(Released)</span>` : `<span style="color:#666;">(Unreleased)</span>`;
    print(`${i + 1}. ${s.name} | Quality: ${s.quality} ${status}`);
  });
}

function releaseSong() {
  let unreleased = songs.filter(s => !s.released);
  if (unreleased.length === 0) { print("No unreleased songs available."); return; }
  showSongs();
  let idx = parseInt(prompt("Enter song number to release globally:")) - 1;
  if (isNaN(idx) || idx < 0 || idx >= songs.length || songs[idx].released) {
    print("Selection error.");
    return;
  }
  let target = songs[idx];
  let tf = 0; let tm = 0;
  for (let p in platforms) {
    tf += Math.floor(target.quality * platforms[p].fame);
    tm += Math.floor(target.quality * platforms[p].money);
  }
  fame += tf; money += tm;
  target.released = true;
  print(`<b>RELEASED:</b> '${target.name}' is now on all platforms! +${tf} Fame, +$${tm} Upfront.`);
  updateStatus();
}

function makeAlbum() {
  let available = songs.filter(s => !s.released);
  if (available.length < 3) { print("Error: You need 3+ unreleased songs."); return; }
  let albumName = prompt("Album Title:");
  if (!albumName) return;
  let selected = [];
  let pool = [...available];
  while (selected.length < 12 && pool.length > 0) {
    let list = pool.map((s, i) => `${i + 1}: ${s.name} (Q:${s.quality})`).join("\n");
    let choice = prompt(`Add track ${selected.length + 1}/12 (type 'done' for 3+ tracks):\n${list}`);
    if (choice?.toLowerCase() === 'done') {
      if (selected.length >= 3) break;
      else { alert("Min 3 tracks required."); continue; }
    }
    let idx = parseInt(choice) - 1;
    if (!isNaN(idx) && idx >= 0 && idx < pool.length) {
      selected.push(pool.splice(idx, 1)[0]);
    } else break;
  }
  if (selected.length < 3) return;
  let avg = selected.reduce((sum, s) => sum + s.quality, 0) / selected.length;
  let af = Math.floor(avg * 5 * selected.length);
  let am = Math.floor(avg * 10 * selected.length);
  selected.forEach(s => s.released = true);
  fame += af; money += am;
  albums.push({ name: albumName, songs: selected, quality: avg });
  print(`<b>ALBUM DROP:</b> '${albumName}' released! Rating: ${avg.toFixed(1)} | +${af} Fame, +$${am} Profit.`);
  updateStatus();
}

function startTour() {
  if (songs.length < 3) { print("You need at least 3 songs to build a setlist."); return; }
  let type = prompt("Select Tour:\n1: Regional\n2: National\n3: Continental\n4: Global");
  let i = parseInt(type) - 1;
  if (type == 4 && albums.length < 1) { print("Global tours require at least 1 album."); return; }
  let names = ["Regional", "National", "Continental", "Global"];
  if (!names[i]) return;
  let shows = [6, 10, 15, 20][i];
  let mult = [1, 1.5, 2.2, 3][i];
  print(`<b>TOURING: ${names[i]} Tour has begun...</b>`);
  let tf = 0; let tm = 0;
  for (let x = 0; x < shows; x++) {
    let gain = Math.floor((Math.random() * 18 + 12 + fame / 20) * mult);
    fame += gain; money += (gain * 3.8); tf += gain; tm += Math.floor(gain * 3.8);
  }
  print(`Tour Finished. Total Fame: +${tf}, Total Profit: +$${tm}`);
  collectRoyalties(); 
  updateStatus();
}

updateStatus();
