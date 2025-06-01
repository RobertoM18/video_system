import { animate } from "animejs";

animate("span", {
  y: [
    { to: "-2.75rem", ease: "outExpo", duration: 600 },
    { to: 0, ease: "outBounce", duration: 800, delay: 100 },
  ],
  // Property specific parameters
  rotate: {
    from: "-1turn",
    delay: 0,
  },
  delay: (_, i) => i * 50, // Function based value
  ease: "inOutCirc",
  loopDelay: 1000,
  loop: false,
});

const $profileIcon = document.querySelector("#profile-btn");

$profileIcon.addEventListener("click", () => {
  animate($profileIcon, {
    y: [
      { to: -30, duration: 250, ease: "outCubic" },
      { to: 0, duration: 300, ease: "outBounce" },
    ],
    loop: false,
    onComplete: () => {
      $profileIcon.dispatchEvent(
        new CustomEvent("animation-complete", { bubbles: true })
      );
    },
  });
});
