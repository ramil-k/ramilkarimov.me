import typography from "@tailwindcss/typography";
import nesting from "postcss-nesting";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "@evilmartians/harmony/tailwind";

const alpha = (color, a) => color.replace("<alpha-value>", a);

let vibrantColors = {
  yellowVibrant: `oklch(90% 0.17 100 / <alpha-value>)`,
  blueVibrant: `oklch(50.31% 0.25 280 / <alpha-value>)`,
  fuchsiaVibrant: `oklch(50% 0.185 320 / <alpha-value>)`,
  redVibrant: `oklch(50% 0.185 20 / <alpha-value>)`,
  redVibrant2: `oklch(65% 0.27 20 / <alpha-value>)`,
};

const hero = [
  `radial-gradient(circle at 0% in oklch,
    ${colors.transparent},
    ${alpha(vibrantColors.redVibrant, 0.3)} 65%,
    ${alpha(vibrantColors.redVibrant, 0.5)} 80%,
    ${alpha(vibrantColors.redVibrant, 0.5)} 90%,
    ${alpha(vibrantColors.redVibrant, 0)} 90.2%,
    ${alpha(vibrantColors.redVibrant, 1)} 120%)`,
  `radial-gradient(farthest-corner at 75% 65% in oklch,
    ${alpha(vibrantColors.blueVibrant, 1)},
    ${alpha(vibrantColors.blueVibrant, 0.8)} 5%,
    ${colors.transparent} 20%,
    ${colors.transparent})`,
  `radial-gradient(farthest-corner at 20% 35% in oklch,
    ${alpha(vibrantColors.redVibrant2, 1)},
    ${alpha(vibrantColors.redVibrant2, 1)} 1%,
    ${alpha(vibrantColors.yellowVibrant, 1)} 15%,
    ${alpha(vibrantColors.yellowVibrant, 1)} 150%)`,
].join(",");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors,
    extend: {
      colors: vibrantColors,
      fontFamily: {
        display: ['"Bellota Text"', ...fontFamily.sans],
      },
      backgroundImage: {
        hero,
      },
      boxShadow: {
        "inset-border": "inset 0px 0px 0px 2px var(--tw-shadow)",
      },
    },
  },
  plugins: [typography, nesting],
};
