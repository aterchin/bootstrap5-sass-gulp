## Gulp front-end toolkit

**If you have not yet installed [Node.js](https://nodejs.org/en/), do that first.**

Install _gulp command line utility_ globally if you haven't yet:

```
npm install --global gulp-cli
```

---

## Install node modules

```
npm install
```

## Using gulp for development and production builds

```
gulp [--production]
``` 

The default task (same as running `gulp build`) will:

- Compile SCSS, add sourcemaps
- Transpile JS, optimize vendor imports, add sourcemaps
- Copy optimized images
- Copy fonts
- Copy extra directories and files

Adding the `--production` flag to `build`, `start` or the following tasks:

- Autoprefix, minify, remove sourcemaps: `styles`
- Minify, remove sourcemaps: `scripts`

Adding the `--analyze` flag to any command using `scripts` will generate a bundle analysis for webpack.

```
gulp start
```

1. Run `build` task
2. Spin up a local browser
3. Watch for file changes and reload browser

### Additional public tasks (individually run)

```
gulp [clean|styles|scripts|images|fonts|extra|webp|guetzli]
```
Delete everything in the `dist` directory; to be run manually:

```
gulp clean
```
Compile SCSS:

```
gulp styles
```
Babel to transpile JS, webpack to optimize vendor imports:

```
gulp scripts
```
Copy optimized images (no `webp` or `guetzli` processing):

```
gulp images
```
Copy fonts

```
gulp fonts
```
`/src/extra` directory can be non-npm vendor packages, files, favicon packages, anything you want to copy over un-modified to `dist`:

```
gulp extra
```
**[webp](https://github.com/imagemin/imagemin-webp#readme)** does not run by default. Webp will compress, copy, and rename with `.webp` extension. So, if you have a .png and .jpg with the same filename, the first one (alphabetically) will be overwritten. Or, you can update the the .webp task to set to one filename or another.

```
gulp webp
```
**[guetzli](https://github.com/imagemin/imagemin-guetzli#readme)** does not run by default. Guetzli is a very high quality JPEG encoder which I've found can produce much better compression and smaller filesize than mozjpeg, but is VERY SLOW (uses a large amount of memory, and can take 1 minute of CPU per 1 MPix of input image). So you generally do NOT want to compress everything in large directories. For that reason, you have to assign directory paths within the images directory for _just those images you plan on compressing._ So if you have a directory `src/images/` which you only want files in `backgrounds` to get processed you add paths to the following constant arrays:
```
const guetzli_paths = ['backgrounds'];

const webp_paths = ['backgrounds']
```

```
gulp guetzli
```

Remember, when you run `gulp clean`, EVERYTHING in `dist` will get deleted.

### Notes

- uses the [Babel](https://babeljs.io/) transpiler to support ES6 JavaScript
- uses [SCSS](https://sass-lang.com/) preprocessor
- Bootstrap v5.x added
- Tiny JavaScript debounce function addded for throttle window events
- [gulp-imagemin](https://github.com/sindresorhus/gulp-imagemin) comes bundled with [optipng](https://github.com/imagemin/imagemin-optipng) but I chose to use [pngquant](https://www.npmjs.com/package/imagemin-pngquant) instead.  Found **pngquant** had FAR superior speed, quality, and filesize results.

#### Initial Setup
1.  Copy `.env.example` to `.env` and update values
2.  Add images to `src/images`
3.  Add fonts to `src/fonts`
4.  Files, libraries, or items that are you do **not** plan to load from node or compile go into `src/extra`
5.  Add custom javascript to `src/js/scripts.js`, you may use import statements.

#### Cleanup/Considerations
  - If you're not using Axios, `npm remove axios` and delete relevant code from `scripts.js`.
  - Run `gulp build` to build out the `dist` directory initially, or run `gulp` to build again from scratch and watch for changes.

  
