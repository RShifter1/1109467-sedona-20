const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
// const del = require("gulp-del");
const svgstore = require("gulp-svgstore")


//build

const build = () => gulp.series (
  "clean",
  "copy",
  "css",
  "sprite",
  "html"
);

//start

const start = () => gulp.series (
  "build",
  "server"
);

// Images

const images = () => {
  return gulp.src("source/img/**/*.{jpg,png,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("source/img"))
}


// WebP

const webpicture = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("source/img"))
}

exports.webp = webpicture;

// Styles

const styles = () => {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;


// sprite

const sprite = () => {
  return gulp.src("source/img/**/icon-*.svg")
  .pipe(svgstore())
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("source/img"))
}

exports.sprite = sprite;

// delete

const clean = () => {
  return del ("build");
}


// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/**/*.{woff, woff2}",
    "source/img/*",
    "source/js/*.js",
    "source/*.ico"

  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
};

exports.copy = copy;





// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);

// gulp.task("build", gulp.series("styles, "));
// gulp.task("start" gulp.series("build, server"));
