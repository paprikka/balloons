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
  const balloon = document.createElement("div");
  const width = naturalWidth / 3;
  const height = naturalHeight / 3;

  balloon.style.position = "absolute";
  balloon.style.width = `${width}px`;
  balloon.style.height = `${height}px`;
  balloon.style.left = `${random() * 100}vw`;
  balloon.style.bottom = `${-height}px`;
  balloon.style.background = `url(${src}) no-repeat`;
  balloon.style.backgroundSize = "100%";

  const basetime = 5000;
  const scaledTime =
    basetime + basetime * (random() - 0.5) * velocityDelta * 2 * baseVelocity;

  const timing = {
    duration: scaledTime,
  };

  const targetY = `calc(-110vh - ${2 * height}px)`;
  const animation = [
    { transform: `translate3d(0, 0, 0)` },
    { transform: `translate3d(0, ${targetY}, 0)` },
  ];

  balloon.animate(animation, timing).finished.then(() => onComplete(balloon));

  return balloon;
};

const makeSpawner = ({ images }) => {
  const state = {
    chanceToSpawn: 0.8,
  };
  let timer;
  const canvas = document.body;
  const tick = () => {
    const shouldSpawn = random() < state.chanceToSpawn;
    if (shouldSpawn) {
      const image = getRandomArrayEntry(images);
      const balloon = makeBalloon(image, (el) => el.remove());
      canvas.appendChild(balloon);
    }
    scheduleNext();
  };

  const getNextInterval = () => 100;

  const scheduleNext = () => {
    timer = setTimeout(tick, getNextInterval());
  };

  const destroy = () => clearTimeout(timer);
  scheduleNext();

  return { state, destroy };
};

Promise.all([
  getPreloadedImages(balloonSprites),
  getPreloadedImages(staticSprites),
]).then(([balloons, static]) => {
  const minTime = 1000;
  const maxTime = 2000;

  const { state, destroy } = makeSpawner({
    images: balloons,
    minTime,
    maxTime,
  });

  const finish = () => {
    const timer = setInterval(() => {
      if (state.chanceToSpawn < 0.01) {
        const floor = document.querySelector(".floor");
        floor.animate(
          [
            { transform: "translate3d(0, 100%, 0)" },
            { transform: "translate3d(0, 0, 0)" },
          ],
          { duration: 300 }
        );

        destroy();
        return clearInterval(timer);
      }
      state.chanceToSpawn = state.chanceToSpawn *= 0.9;
      console.log(state.chanceToSpawn);
    }, 300);
  };

  setTimeout(finish, 0);
});
