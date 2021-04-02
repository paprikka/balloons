const wait = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const range = (from, to) =>
  [...Array(to - from + 1).keys()].map((i) => i + from);

const makeTimeline = (input) =>
  input.reduce(
    (all, [from, to, times]) => [
      ...all,
      ...Array(times)
        .fill(range(from, to))
        .flatMap((_) => _),
    ],
    []
  );

export const addExplosion = (parent, parentWidth, parentHeight) => {
  const parentRect = parent.getBoundingClientRect();
  const offset = { x: -70, y: -30 };
  const sheet = {
    columns: 25,
    columnWidth: 320,
    columnHeight: 480,
    src: "./css_sprites.png",
  };

  const scaled = {
    columnWidth: sheet.columnWidth,
    columnHeight: sheet.columnHeight,
  };

  const container = document.createElement("div");
  container.style.width = `${scaled.columnWidth}px`;
  container.style.height = `${scaled.columnHeight}px`;
  container.style.overflow = "hidden";
  container.style.position = "absolute";
  container.style.left = `${parentRect.x + offset.x}px`;
  container.style.top = `${parentRect.y + offset.y}px`;
  container.style.transform = "translate3d(-55px, -61px, 10px) scale(.8)";
  container.style.pointerEvents = "none";
  container.style.zIndex = 1;

  const sprite = document.createElement("div");
  sprite.style.width = `${scaled.columnWidth * sheet.columns}px`;
  sprite.style.height = `${scaled.columnHeight}px`;
  sprite.style.position = "absolute";
  sprite.style.background = `url(${sheet.src}) top right no-repeat`;
  sprite.style.backgroundSize = "100%";

  container.appendChild(sprite);
  const timeline = makeTimeline([
    [0, 18, 1],
    [17, 19, 10],
    [20, 24, 1],
  ]);

  const fps = 16;
  const play = async () => {
    for (let i = 0; i < timeline.length; i++) {
      const ind = timeline[i];
      const offset = ind * scaled.columnWidth;
      sprite.style.left = `-${offset}px`;
      await wait(1000 / fps);
    }
    container.remove();
  };

  document.body.appendChild(container);
  return { play };
};
