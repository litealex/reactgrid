var gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat');

gulp.task('browserify', function () {
    gulp.src('./src/js/app.js')
        .pipe(browserify({transform: 'reactify'}))
        .on('error', gutil.log)
        .pipe(concat('grid.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('copy', function () {
    gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));

    gulp.src('src/i/*')
        .pipe(gulp.dest('dist/i'));
});

gulp.task('less', function(){
    gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist/css'));
});


gulp.task('default', ['browserify', 'copy', 'less']);


gulp.task('watch', function () {
    gulp.watch('src/**/*.*', ['default']);
});


