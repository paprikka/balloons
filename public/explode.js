const wait = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

export const addExplosion = (parent, parentWidth, parentHeight) => {
  const parentRect = parent.getBoundingClientRect();
  const offset = { x: -70, y: -30 };
  const sheet = {
    columns: 20,
    columnWidth: 320,
    columnHeight: 480,
    src: "./spritesheet.png",
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

  const sprite = document.createElement("div");
  sprite.style.width = `${scaled.columnWidth * sheet.columns}px`;
  sprite.style.height = `${scaled.columnHeight}px`;
  sprite.style.position = "absolute";
  sprite.style.background = `url(${sheet.src}) top right no-repeat`;
  sprite.style.backgroundSize = "100%";

  container.appendChild(sprite);

  const fps = 16;
  const play = async () => {
    let max = sheet.columns;
    while (max--) {
      sprite.style.left = `${-max * scaled.columnWidth}px`;
      await wait(1000 / fps);
      console.log("step");
    }

    container.remove();
  };

  document.body.appendChild(container);

  return { play };
};
