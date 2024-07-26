// const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

export const dartMode = isDarkMode

export const defaultIndex = isDarkMode ? 1 : 0