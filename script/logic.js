const power_button = document.getElementById("power-button");
const dnd_button = document.getElementById("dnd-button");
const volume_up_button = document.getElementById("volume-up-button");
const volume_down_button_button = document.getElementById("volume-down-button");
const text_jam = document.getElementById("clock");
const battery_level = document.getElementById("battery-level");
const dynamic_island = document.getElementById("dynamic-island");
const dynamic_camera = document.getElementById("dynamic-camera");

const dnd = false;
const record = false;
let isAnimating = false;
let plugged = false;
let wasPlugged = false;
let wasFull = false;

//Fungsional Jam
function JamCihuy() {
    const sekarang = new Date();
    let jam = sekarang.getHours().toString().padStart(2, '0');  // Jam
    let menit = sekarang.getMinutes().toString().padStart(2, '0');  // Menit
    const waktu = `${jam}:${menit}`;
    text_jam.textContent = waktu;
}
setInterval(JamCihuy, 60000);
JamCihuy();

function cekcek() {
    if (plugged && !wasPlugged) {
        notif(20, 0, 200);  // Panggil notif hanya saat baru dicolok
    }
    wasPlugged = plugged; // Simpan status saat ini sebagai status sebelumnya
}

setInterval(cekcek, 1000);


//Fungsi Battery & Charge
navigator.getBattery().then(function(battery) {
    function updateBatteryStatus() {
        if ((battery.charging ? "Ya" : "Tidak") == "Ya") {
            battery_level.textContent = Math.round(battery.level * 100) + "%";
            plugged = true;
        } else{
            battery_level.textContent = Math.round(battery.level * 100);
            plugged = false;
        }
    }

    const lv = battery_level.textContent = Math.round(battery.level * 100);

    if(lv === 100 && !wasFull){
        notif(20, 0, 200); // Panggil notifikasi sekali
        wasFull = true;
    }

    if (lv < 100) {
        wasFull = false;
    }
    // Update saat pertama kali dimuat
    setInterval(updateBatteryStatus, 1000);
    updateBatteryStatus();

    // Event listener untuk perubahan status
    battery.addEventListener('levelchange', updateBatteryStatus);
    battery.addEventListener('chargingchange', updateBatteryStatus);
});

dnd_button.addEventListener('click', function () {
  if (isAnimating) return; // Abaikan klik kalau masih animasi
  notif(20, 0, 200);
});

function notif(edw, edh, dur) {
isAnimating = true;
  const box = dynamic_island;
  const cmr = dynamic_camera;
  let startWidth = 70;
  let endWidth = 70+edw;
  let startHeight = 20;
  let endHeight = 20+edh;
  let stc = 55;
  let stcs = stc;
  let currentWidth = startWidth;
  let currentHeight = startHeight;
  let duration = dur; // Durasi animasi dalam milidetik
  let startTime = null;
  let isIncreasing = true; // Menentukan apakah animasi sedang meningkat atau menurun

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = timestamp - startTime;

    // Tentukan arah animasi (meningkat atau menurun)
    if (isIncreasing) {
      // Menghitung lebar dari 70px ke 100px
      currentWidth = startWidth + (endWidth - startWidth) * (progress / duration);
      currentHeight = startHeight + (endHeight - startHeight) * (progress / duration);
      stcs = stc + (stc+edw - stc) * (progress / duration);
    } else {
      // Menghitung lebar dari 100px ke 70px
      currentWidth = endWidth - (endWidth - startWidth) * (progress / duration);
      currentHeight = endHeight - (endHeight - startHeight) * (progress / duration);
      stcs = stc+edw - (stc+edw - stc) * (progress / duration);
    }

    // Set lebar dan tinggi box
    box.style.width = currentWidth + "px";
    box.style.height = currentHeight + "px";
    cmr.style.marginLeft = stcs + "px";

    // Jika durasi animasi belum selesai, lanjutkan animasi
    if (progress < duration) {
  animationId = requestAnimationFrame(animate);
} else {
  box.style.width = isIncreasing ? endWidth + "px" : startWidth + "px";
  box.style.height = isIncreasing ? endHeight + "px" : startHeight + "px";

    if (isIncreasing) {
        setTimeout(() => {
        isIncreasing = false;
        startTime = null;
        animationId = requestAnimationFrame(animate);
        }, 1000); // hanya balik sekali
    } else {
        // selesai, tidak animasi lagi
        animationId = null;
        isAnimating =false;
        }
    }
}

  // Mulai animasi pertamaaa
  requestAnimationFrame(animate);
}