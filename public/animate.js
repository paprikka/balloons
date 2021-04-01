import { addExplosion } from "./explode.js";

const balloonSprites = Array(9)
  .fill("balloon_")
  .map((n, ind) => n + (ind + 1));

const staticSprites = ["dead", "floor"];

const getPreloadedImages = (filenames) => {
  const promises = filenames
    .map((name) => `/${name}.png`)
    .map(
      (src) =>
        new Promise((resolve, reject) => {
          const element = new Image();
          element.src = src;
          element.onload = () => resolve(element);
          element.onerror = reject;
        })
    );

  return Promise.all(promises);
};

const { floor, random } = Math;
const getRandomArrayEntry = (arr) => arr[floor(random() * arr.length)];

const makeBalloon = ({ naturalHeight, naturalWidth, src }, onComplete) => {
  const velocityDelta = 0.1;
  const baseVelocity = 1;
  const element = document.createElement("div");
  const width = naturalWidth / 3;
  const height = naturalHeight / 3;
  const basetime = 15000;
  const scaledTime =
    basetime + basetime * (random() - 0.5) * velocityDelta * 2 * baseVelocity;

  element.style.position = "absolute";
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  element.style.left = `${random() * 100}vw`;
  element.style.bottom = `${-height}px`;
  element.style.background = `url(${src}) no-repeat`;
  element.style.backgroundSize = "100%";
  element.style.overflow = "hidden";

  const timing = { duration: scaledTime };
  const targetY = `calc(-110vh - ${2 * height}px)`;
  const keyframes = [
    { transform: `translate3d(0, 0, 0)` },
    { transform: `translate3d(0, ${targetY}, 0)` },
  ];

  const animation = element.animate(keyframes, timing);
  const dispose = () => onComplete(element);
  animation.finished.then(dispose);

  let isDying = false;
  const kill = () => {
    if (isDying) return;
    isDying = true;
    element.style.background = null;
    addExplosion(element, width, height).play().then(dispose);
  };

  const balloon = { element, kill };
  element.onclick = kill;
  return balloon;
};

const ticker = (onTick, tickDuration, chancePerTick) => {
  let timer;
  const tick = () => {
    const shouldRun = random() < chancePerTick;
    if (shouldRun) onTick();
    scheduleNext();
  };

  const scheduleNext = () => {
    timer = setTimeout(tick, tickDuration);
  };

  const destroy = () => clearTimeout(timer);
  scheduleNext();

  return { destroy };
};

const spawn = ({
  images,
  tickDuration,
  chancePerTick,
  container,
  onAdd,
  onRemove,
}) => {
  const spawn = () => {
    const image = getRandomArrayEntry(images);
    const balloon = makeBalloon(image, (el) => {
      el.remove();
      if (onRemove) onRemove(el);
    });
    container.appendChild(balloon.element);
    if (onAdd) onAdd(balloon);
  };

  ticker(spawn, tickDuration, chancePerTick);
};

const birth = (options) => spawn({ ...options, container: document.body });
const theLiving = (options) =>
  spawn({ ...options, container: document.querySelector(".background") });

const sendToTheFarmToPlayWithOtherPuppies = ({
  tickDuration,
  chancePerTick,
  getAll,
}) => {
  const decimate = () => {
    const all = getAll();
    if (!all.length) return;
    const next = getRandomArrayEntry(all);
    next.kill();
  };
  ticker(decimate, tickDuration, chancePerTick);
};

getPreloadedImages(balloonSprites).then((balloons) => {
  const pool = new Set();

  const add = (sprite) => pool.add(sprite);
  const remove = (sprite) => {
    if (pool.has(sprite)) pool.remove(sprite);
  };
  const getAll = () => [...pool];

  birth({
    images: balloons,
    tickDuration: 100,
    chancePerTick: 1 / 10,
    onAdd: add,
    onRemove: remove,
  });

  // theLiving({
  //   images: balloons,
  //   tickDuration: 100,
  //   chancePerTick: 0.8,
  // });

  sendToTheFarmToPlayWithOtherPuppies({
    tickDuration: 100,
    chancePerTick: 1 / 10,
    getAll,
  });
});
