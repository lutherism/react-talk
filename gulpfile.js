var gulp        = require("gulp"),
    runSequence = require("run-sequence"),
    clean       = require("gulp-clean"),
    rev         = require("gulp-rev"),
    sourcemaps  = require("gulp-sourcemaps"),
    concat      = require("gulp-concat"),
    sass        = require("gulp-sass"),
    fingerprint = require("gulp-fingerprint"),
    react       = require("gulp-react"),
    uglify      = require("gulp-uglify");

// Clean Directories
gulp.task("clean", function() {
  return gulp.src([
    "./vendor/*",
    "./vendor/.pg-assets/**/*",
    "./vendor/.compiled/**/*"
  ], {
    read: false
  })
    .pipe(clean());
});

gulp.task("images", function() {
  return gulp.src(["./node_modules/pg-styleguide-assets/images/**/*"])
    .pipe(rev())
    .pipe(gulp.dest("./vendor"))
    .pipe(rev.manifest())
    .pipe(gulp.dest("./vendor"));
});

gulp.task("fonts", function() {
  return gulp.src(["./node_modules/pg-styleguide-assets/fonts/**/*"])
    .pipe(rev())
    .pipe(gulp.dest("./vendor"))
    .pipe(rev.manifest("./vendor/rev-manifest.json", { base: "./vendor", merge: true }))
    .pipe(gulp.dest("./vendor"));
});

// Stylesheets
gulp.task("scss-to-css", function() {
  var fingerprintManifest = "./vendor/rev-manifest.json",
      fingerprintOptions  = { base: "/fonts/", prefix: "/assets/", mode: "replace"};

  return gulp.src([
    "./node_modules/pg-styleguide-assets/components/**/*.scss",
    "./node_modules/pg-styleguide-assets/stylesheets/**/*.scss",
    "!./node_modules/pg-styleguide-assets/stylesheets/application/base.scss"
  ])
    .pipe(sass({
      errLogToConsole: true,
      includePaths: [
        "./node_modules/pg-styleguide-assets/stylesheets"
      ]
    }))
    .pipe(fingerprint(fingerprintManifest, fingerprintOptions))
    .pipe(gulp.dest("./vendor/.compiled/"));
});

gulp.task("css-concat", function() {
  return gulp.src([
    "./vendor/.compiled/**/*.css"
  ])
    .pipe(sourcemaps.init())
    .pipe(concat("pg-assets.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./vendor/.pg-assets"));
});

// Javascripts
gulp.task("js-concat", function() {
  return gulp.src([
    "./node_modules/pg-styleguide-assets/components/**/*.jsx"
  ])
    .pipe(sourcemaps.init())
    .pipe(react())
    .pipe(concat("pg-assets.js"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./vendor/.pg-assets"));
});


// // Build Processes
// gulp.task("watch", ["default"], function() {
//   gulp.watch("./vendor/stylesheets/**/*", [
//     "scss-to-css",
//     "css-concat"
//   ]);

//   gulp.watch("./vendor/javascripts/**/*", [
//     "js-concat"
//   ]);
// });

gulp.task("default", function() {
  runSequence(
    "clean",
    "images",
    "fonts",
    "scss-to-css",
    "css-concat",
    "js-concat"
  );
});
