// main
import gulp from 'gulp';
import gulpif from "gulp-if";
import dotenv from 'dotenv';
import rsync from 'gulp-rsync';
import yargs from 'yargs';
// hideBin is a shorthand for process.argv.slice(2)
import { hideBin } from 'yargs/helpers';
dotenv.config({ path:'./.env' });

// shared
import del from 'del';
import debug from 'gulp-debug';
import rename from 'gulp-rename';
import changed from 'gulp-changed';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
browserSync.create();

// styles
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import dependents from 'gulp-dependents';
const sass = gulpSass(dartSass);

// scripts
import babel from 'gulp-babel';
import webpack from 'webpack-stream';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import bundleAnalyzer from 'webpack-bundle-analyzer';
bundleAnalyzer.BundleAnalyzerPlugin;

// images
import imagemin, { gifsicle, mozjpeg, svgo } from 'gulp-imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';
import imageminGuetzli from 'imagemin-guetzli';

const argv = yargs(hideBin(process.argv)).argv,
   production = !!argv.production,
   analyze = !!argv.analyze;

console.log('Production environment: ', production);

const paths = {
  src:  'src/',
  dist: 'dist/'
}

const config = {
  styles: {
    src:    paths.src + 'scss/',
    dist:   paths.dist + 'css/',
    globs:  '**/*.scss',
  },
  scripts: {
    src:    paths.src + 'js/',
    dist:   paths.dist + 'js/',
    globs:  '**/*.js',
  },
  images: {
    src:    paths.src + 'images/',
    dist:   paths.dist + 'images/',
    globs:  '**/*.{png,jpg,jpeg,gif,svg,ico}',
  },
  fonts: {
    src:    paths.src + 'fonts/',
    dist:   paths.dist + 'fonts/',
    globs:  '**/*.{ttf,woff,woff2}',
  },
  extra: {
    src:    paths.src + 'extra/',
    dist:   paths.dist + 'extra/',
    globs:  '**/*',
  },
  views: {
    src:    './',
    dist:   './',
    globs:  '**/*.{html,twig,php}',
  }
}

// array of paths within src+dist directories (e.g. 'backgrounds')
const guetzli_paths = [];
const webp_paths = [];

function clean(done) {
  return del([paths.dist + '**/*'], done);
}

function styles() {
  return gulp.src([config.styles.src + config.styles.globs], {
      since: gulp.lastRun(styles)
    })
    .pipe(dependents())
    //.pipe(debug({title: 'dependents:'}))
    .pipe(plumber())
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(
      sass({
        includePaths: ['./node_modules']
      })
      .on('error', sass.logError))
    .pipe(
      gulpif(production, autoprefixer({
        cascade: false,
      }),
    ))
    .pipe(gulpif(production, cleanCSS()))
    .pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.styles.dist))
    .pipe(browserSync.stream());
}

function scripts() {
  let webpackConfig = {
    entry: {
      scripts: './src/js/scripts.js'
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      //chunkFormat: 'commonjs',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups : {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            enforce: true
          },
        },
      },
    },
    plugins: [],
    mode: gulpif(production, 'production', 'development')
  };
  // if --analyze flag is set
  if (analyze) {
    webpackConfig.plugins.concat([
      new bundleAnalyzer.BundleAnalyzerPlugin({
        analyzerPort: 4000,
      }),
    ]);
  }
  return gulp.src([config.scripts.src + 'scripts.js'], {
      since: gulp.lastRun(scripts)
    })
    .pipe(plumber())
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(webpack(webpackConfig))
    .pipe(babel({
      presets: [ '@babel/env' ]
    }))
    //.pipe(concat('scripts.js'))
    .pipe(gulpif(production, uglify()))
    .pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.scripts.dist))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src(config.images.src + config.images.globs, {
      since: gulp.lastRun(images)
    })
    .pipe(changed(config.images.dist))
    .pipe(imagemin([
      mozjpeg({
        quality: 88,
        progressive: true
      }),
      imageminPngquant({
        speed: 1,
        quality: [0.65, 0.85],
        strip: true
      }),
      gifsicle(),
      svgo({
        plugins: [
          {
            name: 'removeViewBox',
            active: false
          }
        ]
      })
    ],
      { verbose: true }
    ))
    .pipe(gulp.dest(config.images.dist))
    .pipe(browserSync.stream());
};

function webp(done) {
  let x = [];
  webp_paths.forEach((path) => {
    x.push(config.images.src + path + '**/*.{png,jpg,jpeg}');
  });
  return x.length === 0 ? done() : gulp.src(x, {
      since: gulp.lastRun(webp)
    })
    .pipe(changed(config.images.dist, {extension: '.webp'}))
    .pipe(imagemin([
      imageminWebp({
        method: 4,
        quality: 88
      })
    ],
      { verbose: true }
    ))
    .pipe(rename({
      extname: '.webp'
    }))
    .pipe(gulp.dest(config.images.dist));
};

function guetzli(done) {
  let x = [];
  guetzli_paths.forEach((path) => {
    x.push(config.images.src + path + '**/*.{jpg,jpeg}');
  });
  return x.length === 0 ? done() : gulp.src(x, {
      since: gulp.lastRun(guetzli)
    })
    .pipe(imagemin([
      imageminGuetzli({
        quality: 87
      })
    ],
      { verbose: true }
    ))
    .pipe(gulp.dest(config.images.dist));
};

function fonts() {
  return gulp.src([config.fonts.src + config.fonts.globs])
    .pipe(gulp.dest(config.fonts.dist));
};

// Extra 3rd-party or pass-through items you don't want to mess with
function extra() {
  return gulp.src([config.extra.src + config.extra.globs])
    .pipe(gulp.dest(config.extra.dist));
};

// Proxy an existing host
// set APP_PROXY_URL in .env
// vhost-based url (local.test)
// local with a port (localhost:8888)
function serve(done) {
  let options = {
    server: {
      baseDir: './'
    }
  };
  //
  if (process.env.APP_PROXY_URL !== undefined) {
    options = {
      proxy: process.env.APP_PROXY_URL
    }
  }
  return browserSync.init(options);
};

function watch() {
  const watchStyles = [
    config.styles.src + config.styles.globs
  ];
  const watchScripts = [
    config.scripts.src + config.scripts.globs
  ];
  const watchFonts = [
    config.fonts.src + config.fonts.globs
  ];
  const watchExtra = [
    config.extra.src + config.extra.globs
  ];
  const watchImages = [
    config.images.src + config.images.globs
  ];
  const watchViews = [
    config.views.src + config.views.globs
  ];

  gulp.watch(watchStyles, gulp.series(styles)).on('change', browserSync.reload);
  gulp.watch(watchScripts, gulp.series(scripts)).on('change', browserSync.reload);
  gulp.watch(watchFonts, gulp.series(fonts)).on('change', browserSync.reload);
  gulp.watch(watchExtra, gulp.series(extra)).on('change', browserSync.reload);
  gulp.watch(watchImages, gulp.series(images)).on('change', browserSync.reload);
  gulp.watch(watchViews).on('change', browserSync.reload);
}


// rsync -av --progress
function remoteSync(done) {
  let host = gulpif(production, process.env.DEPLOY_PROD_HOST, process.env.DEPLOY_DEV_HOST);
  let dest = gulpif(production, process.env.DEPLOY_PROD_DEST, process.env.DEPLOY_DEV_DEST);
  let user = gulpif(production, process.env.DEPLOY_PROD_USER, process.env.DEPLOY_DEV_USER);
  let scmd = gulpif(production, process.env.DEPLOY_PROD_SCMD, process.env.DEPLOY_DEV_SCMD);
  return gulp.src(paths.dist + '**')
    .pipe(rsync({
      root: paths.dist,
      username: user,
      hostname: host,
      destination: dest + paths.dist,
      rsh: scmd,
      archive: true,
      silent: false,
      progress: true
    }));
}

export { clean, styles, scripts, images, fonts, extra, webp, guetzli };

export const build = gulp.series(styles, scripts, images, fonts, extra);
export const start = gulp.series(build, gulp.parallel(serve, watch));
export const deploy = gulp.series(build, remoteSync);

export default build;
