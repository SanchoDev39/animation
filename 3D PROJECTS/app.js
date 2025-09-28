const track = document.getElementById("image-track");

// Initialize dataset properties
track.dataset.mouseDownAt = "0";
track.dataset.prevPercentage = "0";
track.dataset.percentage = "0";

const getClientX = (e) => {
  if (e.touches || e.changedTouches) {
    const touch = e.touches[0] || e.changedTouches[0];
    return touch ? touch.clientX : 0;
  }
  return e.clientX;
};

const handleOnDown = (e) => {
  track.dataset.mouseDownAt = getClientX(e).toString();
};

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";
  track.dataset.prevPercentage = track.dataset.percentage;
};

const handleOnMove = (e) => {
  if (track.dataset.mouseDownAt === "0") return;

  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - getClientX(e),
    maxDelta = window.innerWidth / 2;

  const percentage = (mouseDelta / maxDelta) * -100,
    nextPercentageUnconstrained =
      parseFloat(track.dataset.prevPercentage) + percentage,
    nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

  track.dataset.percentage = nextPercentage;

  track.animate(
    {
      transform: `translate(${nextPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );

  for (const image of track.getElementsByClassName("image")) {
    image.animate(
      {
        objectPosition: `${100 + nextPercentage}% center`,
      },
      { duration: 1200, fill: "forwards" }
    );
  }
};

// Use addEventListener instead of window.on* for better compatibility
window.addEventListener("mousedown", handleOnDown);
window.addEventListener("touchstart", (e) => handleOnDown(e), {
  passive: false,
});

window.addEventListener("mouseup", handleOnUp);
window.addEventListener("touchend", (e) => handleOnUp(e), { passive: false });

window.addEventListener("mousemove", handleOnMove);
window.addEventListener("touchmove", (e) => handleOnMove(e), {
  passive: false,
});

// Fixed image enlargement (toggle on click)
function setupImageClicks() {
  const images = document.getElementsByClassName("image");
  for (const image of images) {
    image.addEventListener("click", (e) => {
      const target = e.target;
      if (target.style.transform === "scale(2)") {
        target.style.transform = "scale(1)"; // Reset
      } else {
        target.style.transform = "scale(2)"; // Enlarge
      }
    });
  }
}

setupImageClicks(); // Call the function to set up listeners

/* -- Had to add extra lines for touch events -- 

window.onmousedown = (e) => handleOnDown(e);

window.ontouchstart = (e) => handleOnDown(e.touches[0]);

window.onmouseup = (e) => handleOnUp(e);

window.ontouchend = (e) => handleOnUp(e.touches[0]);

window.onmousemove = (e) => handleOnMove(e);

window.ontouchmove = (e) => handleOnMove(e.touches[0]);

function imageSize() {
  const imageSize = document.getElementsByTagName("img");
  for (image in imageSize) {
    image.addEventListener("click", function () {
      image.style.transform = "scale(4)";
    });
  }
  return image;
}
imageSize(); */
