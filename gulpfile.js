// Connection dependencies
const { src, dest, watch, series, parallel } = require('gulp')
const del = require('del')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const mmq = require('gulp-merge-media-queries')
const autoprefixer = require('gulp-autoprefixer')
const pug = require('gulp-pug')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const insert = require('gulp-insert')
const replace = require('gulp-replace')
const include = require('gulp-include')

// Task functions for development mode
const setEnv = (cb) => {
    process.env.NODE_ENV = 'dev';
    cb();
}

const devMocksData = () => {
    return src('./src/mocks/**/*')
        .pipe(dest('build/mocks'))
        .pipe(browserSync.stream())
}

const devVendorCss = () => {
    return src('./src/vendor/scss/**/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError( function(err){
                return {
                    title: 'Scss styles Error',
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            basename: 'vendor'
        }))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(dest('build/css'))
        .pipe(browserSync.stream())
}

const devCommonCss = () => {
    return src('./src/scss/**/*.scss')
        .pipe(plumber({
            errorHandler: notify.onError( function(err){
                return {
                    title: 'Scss styles Error',
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            basename: 'main'
        }))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(dest('build/css'))
        .pipe(browserSync.stream())
}

const devCustomCss = () => {
    return src('./src/pages/**/style.scss')
        .pipe(plumber({
            errorHandler: notify.onError( function(err){
                return {
                    title: 'Scss styles Error',
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename(fileObj => {
            fileObj.basename = fileObj.dirname;
            fileObj.dirname = '';
        }))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(dest('build/css/pages'))
        .pipe(browserSync.stream())
}

const devVendorJs = () => {
    return src('./src/vendor/js/**/*.js')
        .pipe(plumber({
                errorHandler: notify.onError( function(err){
                    return {
                        title: 'JS Error',
                        message: err.message
                    }
                })
            }))
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(dest('build/js'))
        .pipe(browserSync.stream())
}

const devCommonJs = () => {
    return src([
            './src/js/utils/**/*.js',
            './src/components/**/*.js',
            '!./src/components/product/**/*.js',
            './src/template/**/*.js',
            './src/js/main.js',
            './src/js/**/*.js'
        ])
        .pipe(plumber({
                errorHandler: notify.onError( function(err){
                    return {
                        title: 'JS Error',
                        message: err.message
                    }
                })
            }))
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(insert.prepend("'use strict';\n\n"))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(dest('build/js'))
        .pipe(browserSync.stream())
}

const devCustomJs = () => {
    return src('./src/pages/**/script.js')
        .pipe(plumber({
                errorHandler: notify.onError( function(err){
                    return {
                        title: 'JS Error',
                        message: err.message
                    }
                })
            }))
        .pipe(sourcemaps.init())
        .pipe(include())
            .on('error', console.log)
        .pipe(rename(fileObj => {
            fileObj.basename = fileObj.dirname;
            fileObj.dirname = '';
        }))
        // .pipe(insert.prepend("'use strict';\n\n"))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(dest('build/js/pages'))
        .pipe(browserSync.stream())
}

const devHmtl = () => {
    return src('src/pages/**/index.pug')
        .pipe(plumber({
            errorHandler: notify.onError( function(err){
                return {
                    title: 'Pug Error',
                    message: err.message
                }
            })
        }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(replace(/\/>/g, '>'))
        .pipe(rename(fileObj => {
            fileObj.basename = fileObj.dirname;
            fileObj.dirname = '';
        }))
        .pipe(plumber.stop())
        .pipe(dest('build'))
        .pipe(browserSync.stream())
}

// Task functions for build mode
const buildMocksData = () => {
    return src('./src/mocks/**/*')
        .pipe(dest('build/mocks'))
}

const buildVendorCss = () => {
    return src('./src/vendor/scss/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(mmq({
            log: true,
            skipMQErrors: true
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass.sync({
            outputStyle: 'compressed'
        }))
        .pipe(rename({
            basename: 'vendor',
            suffix: '.min'
        }))
        .pipe(dest('build/css'))
}

const buildCommonCss = () => {
    return src('./src/scss/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        // .pipe(mmq({
        //     log: true,
        //     skipMQErrors: true
        // }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass.sync({
            outputStyle: 'compressed'
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(dest('build/css'))
}

const buildCustomCss = () => {
    return src('./src/pages/**/style.scss')
        .pipe(sass.sync().on('error', sass.logError))
        // .pipe(mmq({
        //     log: true,
        //     skipMQErrors: true
        // }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass.sync({
            outputStyle: 'compressed'
        }))
        .pipe(rename(fileObj => {
            fileObj.basename = fileObj.dirname + '.min';
            fileObj.dirname = '';
        }))
        .pipe(dest('build/css/pages'))
}

const buildVendorJs = () => {
    return src('./src/vendor/js/**/*.js')
        .pipe(concat('vendor.js'))
        // .pipe(babel({
        //     presets: [
        //         ['@babel/preset-env']
        //     ]
        // }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('build/js'))
}

const buildCommonJs = () => {
    return src([
            './src/js/utils/**/*.js',
            './src/components/**/*.js',
            '!./src/components/product/**/*.js',
            './src/template/**/*.js',
            './src/js/main.js',
            './src/js/**/*.js'
        ])
        .pipe(concat('main.js'))
        .pipe(babel({
            compact: false,
            presets: [
                ['@babel/preset-env']
            ]
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest('build/js'))
}

const buildCustomJs = () => {
    return src('./src/pages/**/script.js')
        .pipe(include())
            .on('error', console.log)
        .pipe(babel({
            compact: false,
            presets: [
                ['@babel/preset-env']
            ]
        }))
        .pipe(uglify())
        .pipe(rename(fileObj => {
            fileObj.basename = fileObj.dirname + '.min';
            fileObj.dirname = '';
        }))
        .pipe(dest('build/js/pages'))
}

const buildHmtl = () => {
    return src('src/pages/**/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(replace(/\/>/g, '>'))
        .pipe(rename(fileObj => {
            fileObj.basename = fileObj.dirname;
            fileObj.dirname = '';
        }))
        .pipe(dest('build'))
}

// Common task functions
const clean = () => {
    return del('./build')
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 7000
    })
}

// Watchers
watch('./mocks/**/*', devMocksData)
watch('./src/vendor/scss/**/*.scss', devVendorCss)
watch('./src/scss/**/*.scss', devCommonCss)
watch('./src/template/**/*.scss', devCommonCss)
watch('./src/components/**/*.scss', devCommonCss)
watch('./src/pages/**/*.scss', devCustomCss)
watch('./src/vendor/js/**/*.js', devVendorJs)
watch('./src/js/**/*.js', devCommonJs)
watch('./src/template/**/*.js', devCommonJs)
watch('./src/components/**/*.js', devCommonJs)
watch('./src/pages/**/*.js', devCustomJs)
watch('./src/**/*.pug', devHmtl)

// Project development mode
exports.default = series(
    clean,
    setEnv,
    parallel(
        devMocksData,
        devVendorCss,
        devCommonCss,
        devCustomCss,
        devVendorJs,
        devCommonJs,
        devCustomJs,
        devHmtl
    ),
    server
)

// Project build mode
exports.build = series(
    clean,
    parallel(
        buildMocksData,
        buildVendorCss,
        buildCommonCss,
        buildCustomCss,
        buildVendorJs,
        buildCommonJs,
        buildCustomJs,
        buildHmtl
    ),
    function buildDone(done) {
        done()
        process.exit()
    }
)