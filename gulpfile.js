'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

gulp.task('default', ['sass', 'cssmin']);

gulp.task('sass', function () {
    gulp.src('./css/src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/dist'));
});

gulp.task('cssmin', function () {
    gulp.src('./css/dist/**/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./css/dist'));
});