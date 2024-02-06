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

## Adding to an existing WordPress project

**I would highly recommend duplicating the theme so you can compare differences with the original.  Use a plugin like [Theme Switcha](https://wordpress.org/plugins/theme-switcha/) and an incognito window for easy comparison.**  You could also create a child theme, but I might make an argument for creating a clean _new_ version from the start, versus trying to prune unused assets both at the end of the project vs at the beginning.


#### Initial Setup
1. Download the repo, expand zip and rename with temporary new name for theme.  I usually tack on a unique name to the new theme directory which I can find in the code easily if I need to do a search and replace. 
2. Create a `style.css` file and copy the following

```
/*
 * Theme Name: Theme Name MMYYYY (or whatever)
 */
```

3.  Install any packages in the previous `package.json` file you want to persist in this theme.
4.  Copy or integrate all dotfiles.  Also, copy `.env.example` to `.env` and adjust values.
5.  Copy all images to `src/images`; remove images that came with this package.
6.  Copy all fonts to `src/fonts`; remove fonts that came with this package.
7.  Copy all additional packages, files, folders, or 3rd-party items that are you do **not** plan to load from npm into to `src/extra`.
8.  Copy all views (`.php` ,`.html`, `.twig`, etc...) to mirror previous theme locations.
9.  Copy Javascript code over to `src/js/scripts.js`, and import anything from `node_modules`.
10. Couple options for styles: (1) update your folder structure to match this tookit or (2) copy SCSS over and replace existing folder structure.
11. In your `functions.php` file, update the `wp_enqueue_scripts` and `wp_enqueue_styles` to reflect `dist` assets folder. Remember, if loading Bootstrap directly in the theme previously, you can now remove it.

#### Cleanup/Considerations
  - If committing `dist` directory to the repo, remove `dist` line from `.gitignore`.
  - If you're not using Axios, `npm remove axios` and delete relevant code from `scripts.js`.
  - You might have to uninstall this version of Bootstrap if your old theme does not match this one, then reinstall an older one via npm.
  - Run `gulp build` to build out the `dist` directory initially, or run `gulp` to build again from scratch and watch for changes.
  - Strive for consistency. When you are copying SCSS files over, you might want to spend the time to match the folder structure and filenames from this toolkit. These were created from commonly used conventions which apply to many sites.

  
