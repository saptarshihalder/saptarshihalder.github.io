const quotes = [
  ["Tears, idle tears, I know not what they mean.", "Alfred Tennyson"],
  ["After great pain, a formal feeling comes.", "Emily Dickinson"],
  ["I'm nobody! Who are you?", "Emily Dickinson"],
  ["Better by far you should forget and smile than that you should remember and be sad.", "Christina Rossetti"],
  ["For the world's more full of weeping than you can understand.", "W. B. Yeats"],
  ["The lone and level sands stretch far away.", "Percy Bysshe Shelley"],
  ["Here lies one whose name was writ in water.", "John Keats"],
  ["Parting is all we know of heaven, and all we need of hell.", "Emily Dickinson"],
];

const home = "/home/";
const stay = 7500;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.querySelector("canvas");
const pen = canvas.getContext("2d", { willReadFrequently: true });
const steps = document.querySelectorAll(".steps i");
const start = performance.now();
let leaving = false;
let lastFrame = -1;

const [line, author] = quotes[Math.floor(Math.random() * quotes.length)];
document.querySelector("blockquote p").textContent = line;
document.querySelector("figcaption").textContent = author;

function reach([x, y], angle, length) {
  return [x + Math.sin(angle) * length, y + Math.cos(angle) * length];
}

function stroke(points, width, color) {
  pen.strokeStyle = color;
  pen.lineWidth = width;
  pen.lineCap = "round";
  pen.lineJoin = "round";
  pen.beginPath();
  pen.moveTo(...points[0]);
  for (const point of points.slice(1)) pen.lineTo(...point);
  pen.stroke();
}

function dot([x, y], radius, color) {
  pen.fillStyle = color;
  pen.beginPath();
  pen.arc(x, y, radius, 0, Math.PI * 2);
  pen.fill();
}

function leg(hip, phase, color) {
  const thigh = Math.sin(phase) * 0.42;
  const bend = (1 + Math.sin(phase - 1.2)) * 0.38;
  const knee = reach(hip, thigh, 8);
  const ankle = reach(knee, thigh - bend, 8);
  stroke([hip, knee, ankle, [ankle[0] + 2.5, ankle[1]]], 3, color);
}

function arm(shoulder, phase, color) {
  const elbow = reach(shoulder, 0.25 - Math.sin(phase) * 0.22, 5);
  stroke([shoulder, elbow, reach(elbow, 0.05 - Math.sin(phase) * 0.18, 5)], 2.4, color);
}

function draw(cycle) {
  const phase = cycle * Math.PI * 2;
  const hip = [18, 30 - Math.max(0, Math.cos(phase * 2)) * 0.8];
  const shoulder = [hip[0] + 4.5, hip[1] - 10.5];
  const far = "#4a4c50";
  const near = "#5f6166";

  pen.clearRect(0, 0, canvas.width, canvas.height);
  leg(hip, phase + Math.PI, far);
  arm(shoulder, phase, far);
  stroke([hip, [hip[0] + 0.5, hip[1] - 6], shoulder], 6, near);
  dot([hip[0] + 2, hip[1] - 9], 4, near);
  dot([shoulder[0] + 3, shoulder[1] + 1.5], 3.2, near);
  leg(hip, phase, near);
  arm(shoulder, phase + Math.PI, near);

  const image = pen.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = image.data;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 110) {
      pixels[i + 3] = 0;
      continue;
    }
    pixels.set(pixels[i] > 84 ? [95, 97, 102] : [74, 76, 80], i);
    pixels[i + 3] = 255;
  }
  pen.putImageData(image, 0, 0);
}

function go() {
  if (leaving) return;
  leaving = true;
  document.body.classList.add("leaving");
  setTimeout(() => location.replace(home), still ? 0 : 600);
}

function frame(time) {
  const elapsed = time - start;
  const step = Math.min(Math.floor(elapsed / (stay / steps.length)), steps.length - 1);
  steps.forEach((light, index) => light.classList.toggle("lit", index === step));

  const tick = Math.floor(elapsed / 83);
  if (tick !== lastFrame) {
    lastFrame = tick;
    draw((elapsed / 1900) % 1);
  }

  if (elapsed >= stay) go();
  else requestAnimationFrame(frame);
}

for (const eventName of ["click", "keydown"]) {
  document.addEventListener(eventName, go);
}

if (still) {
  draw(0.15);
  steps[0].classList.add("lit");
  setTimeout(go, stay);
} else {
  requestAnimationFrame(frame);
}
