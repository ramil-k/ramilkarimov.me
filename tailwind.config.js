import typography from "@tailwindcss/typography";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "@evilmartians/harmony/tailwind";

const css = String.raw;
const alpha = (color, a) => color.replace("<alpha-value>", a);

let vibrantColors = {
  yellowVibrant: `oklch(90% 0.17 100 / <alpha-value>)`,
  blueVibrant: `oklch(50.31% 0.25 280 / <alpha-value>)`,
  fuchsiaVibrant: `oklch(50% 0.185 320 / <alpha-value>)`,
  redVibrant: `oklch(50% 0.185 20 / <alpha-value>)`,
  redVibrant2: `oklch(65% 0.27 20 / <alpha-value>)`,
};

const hero = [
  css`radial-gradient(circle at 0% in oklch,
    ${colors.transparent},
    ${alpha(vibrantColors.redVibrant, 0.3)}/*a*/ 65%,
    ${alpha(vibrantColors.redVibrant, 0.5)}/*c*/ 80%,
    ${alpha(vibrantColors.redVibrant, 0.5)}/*c*/ 90%,
    ${alpha(vibrantColors.redVibrant, 0)}/*6*/ 90%,
    ${alpha(vibrantColors.redVibrant, 1)} 120%)`,
  css`radial-gradient(farthest-corner at 75% 65% in oklch,
    ${alpha(vibrantColors.blueVibrant, 1)},
    ${alpha(vibrantColors.blueVibrant, 0.8)} 5%,
    ${colors.transparent} 20%,
    ${colors.transparent})`,
  css`radial-gradient(farthest-corner at 20% 35% in oklch,
    ${alpha(vibrantColors.redVibrant2, 1)},
    ${alpha(vibrantColors.redVibrant2, 1)} 1%,
    ${alpha(vibrantColors.yellowVibrant, 1)} 15%,
    ${alpha(vibrantColors.yellowVibrant, 1)} 150%)`,
  // css`radial-gradient(farthest-corner at 30% 45% in oklch,
  //   ${alpha(colors.blue["900"], 1)},
  //   ${alpha(colors.blue["800"], 1)} 10%,
  //   ${alpha(colors.fuchsia["900"], 1)} 25%,
  //   ${alpha(colors.fuchsia["950"], 1)} 150%)`,
].join(",");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors,
    extend: {
      colors: vibrantColors,
      fontFamily: {
        display: ["Bellota Text", ...fontFamily.sans],
      },
      backgroundImage: {
        hero,
      },
      boxShadow: {
        "inset-border": "inset 0px 0px 0px 3px var(--tw-shadow)",
      },
    },
  },
  plugins: [typography],
};
