# krypta
### SvelteKit project
a website to handle some custom configurations for a streaming server and also allows users to upload gif files. 
`WIP`

## WIP/missing features
- persistent dark mode
- ability to manipulate the uploaded images (mainly a delete button)
- responsivity
- services are not really "services" right now, just implementations
- better types

#### stream related, stuff under tools
- style configuration for stream messages (discord)

## dependencies
- [SvelteKit](https://kit.svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/) (in hindsight this was a mistake with SvelteKit)
- [MySQL2](https://github.com/sidorares/node-mysql2)
- [Auth.js](https://authjs.dev/reference/sveltekit)
- [sharp](https://github.com/lovell/sharp)
- [Fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [sanitize-filename](https://github.com/parshap/node-sanitize-filename)

## static content
- [xicons](https://www.xicons.org/) SVG icons

## run
install dependencies

    pnpm install
then run

    pnpm dev