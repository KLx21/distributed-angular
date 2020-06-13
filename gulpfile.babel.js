const del = require('del');
const gulp = require('gulp');
const gLoadPlugins = require('gulp-load-plugins');
const lodash = require('lodash');
const log = require('fancy-log');
const {rollup} = require('rollup');
const rollupCommonJS = require('@rollup/plugin-commonjs');
const rollupNodeResolve = require('@rollup/plugin-node-resolve').default;
const rollupSourcemaps = require('rollup-plugin-sourcemaps');
const rollupTerser = require('rollup-plugin-terser');
const gDebug = require('gulp-debug');
const merge = require('merge2');

const clientConfig = require('./client.config');
const utils = require('./gulp-utils');
const pkg = require('./package.json');

const singleFolderNames = clientConfig.singleFolderNames;
const folders = clientConfig.folders;
const fileNames = clientConfig.fileNames;
const filePaths = clientConfig.filePaths;

const gPlugins = gLoadPlugins({
  config: `${ folders.projectRoot }/package.json`
});
const tsProject = gPlugins.typescript.createProject(`${ folders.client }/tsconfig.json`);

const cleanUpAll = gulp.parallel(
  cleanTmpCoreBundle,
  cleanTmpTranspiledClient,
  // cleanTmpGlobalRxjs,
  cleanTmpNgDependencies,
  cleanServerFiles
);

const transpileClient = gulp.series(
  cleanTmpTranspiledClient,
  doTsLintClient,
  doTranspileClient
);

const bundleApp = gulp.series(
  gulp.parallel(
    cleanTmpCoreBundle,
    cleanTmpDepsBundle
  ),
  transpileClient,
  doBundleApp
  // removeSourceFiles
);

const bundleGlobalRxjs = gulp.series(
  // cleanTmpGlobalRxjs,
  doBundleGlobalRxjs
);

const prepareNgFiles = gulp.series(
  bundleApp
  // bundleGlobalRxjs
);

const injectIndexHtml = gulp.series(
  copyPrerequisites,
  prepareNgFiles,
  doStaticResourceInjection
);

const prepareUiFiles = gulp.series(
  injectIndexHtml,
  distUiFiles
);

const prepareServerFiles = gulp.series(
  cleanServerFiles,
  gulp.parallel(
    gulp.series(
      copyPackageJson,
      doNpmInstall
    ),
    distServerFiles
  )
);

lodash.assign(exports, {
  bundleApp,
  // bundleGlobalRxjs,
  cleanUpAll,
  dist: gulp.parallel(
    prepareUiFiles,
    prepareServerFiles
  ),
  injectIndexHtml,
  npmInstall: gulp.series(
    copyPackageJson,
    doNpmInstall
  ),
  prepareNgFiles,
  prepareServerFiles,
  prepareUiFiles,
  transpileCoreClient: transpileClient
});

/*************************/
/* Function declarations */

/*************************/

function cleanServerFiles() {
  return del(folders.distServer);
}

/**
 * Remove the Angular 2 app files including the "ng2-app.bundle.js" file and the "ng2-app.bundle.min.js" file as well as
 * the corresponding source map files from the "tmp" folder.
 */
function cleanTmpCoreBundle() {
  return del([
    fileNames.coreJSFile,
    fileNames.coreJSFile + '.map',
    fileNames.minCoreJSFile,
    fileNames.minCoreJSFile + '.map'
  ], {
    cwd: folders.tmp
  });
}

function cleanTmpDepsBundle() {
  return del([
    fileNames.depsJSFile,
    fileNames.depsJSFile + '.map',
    fileNames.minDepsJSFile,
    fileNames.minDepsJSFile + '.map'
  ], {
    cwd: folders.tmp
  });
}

/**
 * Remove the RxJS bundle files including the "ng2-rxjs.bundle.js" file and the "ng2-rxjs.bundle.min.js" file, as well
 * as the corresponding source map files from the "tmp" folder.
 */
function cleanTmpGlobalRxjs() {
  return del([
    fileNames.globalRxJsFile,
    fileNames.globalRxJsFile + '.map',
    fileNames.minGlobalRxJsFile,
    fileNames.minGlobalRxJsFile + '.map'
  ], {
    cwd: folders.tmp
  });
}

/**
 * Remove the Angular 2 dependency files including the "ng2-deps.bundle.js" file and the "ng2-deps.bundle.min.js" file,
 * as well as the corresponding source map files from the "tmp" folder.
 */
function cleanTmpNgDependencies() {
  return del([
    ...[
      fileNames.depsJSFile,
      fileNames.depsJSFile + '.map',
      fileNames.minDepsJSFile,
      fileNames.minDepsJSFile + '.map'
    ],
    ...filePaths.ng2DepsToCopy
  ], {
    cwd: folders.tmp
  });
}

/*
* Remove the "client" folder from the "tmp" folder. This "client" folder is for containing all JavaScript files that
* are transpiled from the Typescript source code.
*/
function cleanTmpTranspiledClient() {
  return del(folders.tmpTranspiled);
}

function copyPackageJson() {
  return gulp
    .src(fileNames.packageJson, {
      base: folders.projectRoot,
      cwd: folders.projectRoot
    })
    .pipe(gulp.dest(folders.dist));
}

function copyPrerequisites() {
  return gulp
    .src(filePaths.prerequisiteJSFiles, {
      base: folders.nodeModulesPrefix,
      cwd: folders.nodeModulesPrefix
    })
    .pipe(gulp.dest(folders.tmpPrereq));
}

function distServerFiles() {
  return gulp
    .src('*', {
      base: folders.projectRoot,
      cwd: folders.server
    })
    .pipe(gulp.dest(folders.dist));
}

function distUiFiles() {
  return gulp
    .src([
      '*',
      '*/**'
    ], {
      base: folders.tmp,
      cwd: folders.tmp
    })
    .pipe(gulp.dest(folders.distClient));
}

function doBundleApp() {
  return rollup({
    input: `${ folders.tmpTranspiled }/main.js`,
    plugins: [
      rollupSourcemaps(),
      rollupNodeResolve(),
      rollupCommonJS()
    ],
    manualChunks: function (id) {
      if (lodash.includes(id, 'node_modules')) {
        return 'deps';
      }
    },
    treeshake: false
  })
    // .then(bundle => bundle.write({
    //   file: `${ folders.tmpJs }/main.js`,
    //   format: 'umd',
    //   name: 'main',
    //   globals: {
    //     '@angular/core': 'ng.core',
    //     '@angular/common': 'ng.common',
    //     '@angular/router': 'ng.router',
    //     '@angular/compiler': 'ng.compiler',
    //     '@angular/forms': 'ng.forms',
    //     '@angular/platform-browser': 'ng.platformBrowser',
    //     '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
    //     '@angular/common-http': 'ng.common.http'
    //   },
    //   sourcemap: true
    // }))
    .then(bundle => {
      return Promise.all([
        bundle.write({
          chunkFileNames: '[name].js',
          dir: `${ folders.tmpJs }`,
          entryFileNames: '[name].js',
          format: 'systemjs',
          globals: {
            '@angular/core': 'ng.core',
            '@angular/common': 'ng.common',
            '@angular/router': 'ng.router',
            '@angular/compiler': 'ng.compiler',
            '@angular/forms': 'ng.forms',
            '@angular/platform-browser': 'ng.platformBrowser',
            '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
            '@angular/common-http': 'ng.common.http'
          },
          sourcemap: true
        }),
        bundle.write({
          chunkFileNames: '[name].min.js',
          compact: true,
          dir: `${ folders.tmpJs }`,
          entryFileNames: '[name].min.js',
          format: 'systemjs',
          globals: {
            '@angular/core': 'ng.core',
            '@angular/common': 'ng.common',
            '@angular/router': 'ng.router',
            '@angular/compiler': 'ng.compiler',
            '@angular/forms': 'ng.forms',
            '@angular/platform-browser': 'ng.platformBrowser',
            '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
            '@angular/common-http': 'ng.common.http'
          },
          sourcemap: true,
          plugins: [
            rollupTerser.terser()
          ]
        })
      ]);
    })
    .catch(utils.onError);
}

function doBundleGlobalRxjs() {
  return rollup({
    input: `${ folders.nodeModulesPrefix }/rxjs/Rx.js`,
    plugins: [
      rollupSourcemaps(),
      rollupNodeResolve(),
      rollupCommonJS()
    ],
    treeshake: true
  })
    .then(builder => {
      return Promise.all([
        builder.write({
          file: `${ folders.tmp }/${ fileNames.globalRxJsFile }`,
          format: 'umd',
          name: 'rxjs',
          sourcemap: true
        }),
        builder.write({
          file: `${ folders.tmp }/${ fileNames.minGlobalRxJsFile }`,
          format: 'umd',
          name: 'rxjs',
          sourcemap: true,
          plugins: [
            rollupTerser.terser()
          ]
        })
      ]);
    })
    .catch(utils.onError);
}

function doNpmInstall() {
  return gPlugins
    .runCommand
    .default(
      '/home/huanli/.nvm/versions/node/v10.20.1/bin/node /home/huanli/.nvm/versions/node/v10.20.1/bin/npm i --production',
      {
        cwd: folders.dist
      }
    )();
}

function doTranspileClient() {
  const srcFileStream = gulp
    .src(filePaths.ng2CoreSrcTSFiles, {
      base: folders.srcClient,
      cwd: folders.srcClient
    });
  const envFileStream = gulp
    .src(`environments/environment${ utils.inProduction() ? '.prod' : '' }.ts`, {
      base: folders.srcClient,
      cwd: folders.srcClient
    })
    .pipe(gPlugins.if(utils.inProduction(), gPlugins.rename('environments/environment.ts')));

  return merge(srcFileStream, envFileStream)
    .pipe(gPlugins.sourcemaps.init())
    .pipe(gPlugins.inlineNg2Template({
      base: folders.srcClient,
      useRelativePaths: true,
      removeLineBreaks: true,
      templateProcessor: utils.minifyTemplate,
      customFilePath: utils.convertExtensions,
      styleProcessor: utils.processScss
    }))
    .pipe(tsProject(gPlugins.typescript.reporter.fullReporter(true)))
    .pipe(gPlugins.sourcemaps.write())
    .pipe(gulp.dest(folders.tmpTranspiled))
    .on('error', utils.onError);
}

/**
 * Lint our source code in Typescript, which is in the "server_express" folder for now, and generate a report.
 */
function doTsLintClient() {
  return gulp
    .src(filePaths.ng2CoreSrcTSFiles, {
      cwd: folders.client
    })
    .pipe(gPlugins.tslint({
      configuration: `${ folders.client }/tslint.json`
    }))
    .pipe(gPlugins.tslint.report({
      emitError: false
    }))
    .on('error', utils.onError);
}

function doStaticResourceInjection() {
  // const globalRxjsFileStream = utils.createFilesStream(
  //   !utils.inDevelopment() ? fileNames.minGlobalRxJsFile : fileNames.globalRxJsFile,
  //   folders.tmp
  // );

  const prerequisiteJsFileStream = utils.createFilesStream(
    filePaths.prerequisiteJSFiles,
    folders.tmpPrereq
  );

  return gulp
    .src('index.html', {
      base: folders.srcClient,
      cwd: folders.srcClient
    })
    .pipe(gulp.dest(folders.tmp))
    .pipe(gPlugins.injectString.replace(
      '<!-- entry-point:js -->',
      `
        <script type="text/javascript">System.import('${singleFolderNames.js}/main.js')</script>
      `
      )
    )
    .pipe(gPlugins.inject(prerequisiteJsFileStream, {
      name: 'prerequisite',
      relative: true
    }))
    .pipe(gulp.dest(folders.tmp));
}

function removeSourceFiles() {
  return Promise.all([
    del(folders.tmpTranspiled),
    del(
      lodash.map(filePaths.ng2DepsToCopy, glob => `${ glob }/**/*.@(j|t)s?(.map)`),
      {
        cwd: folders.tmp
      }
    )
  ])
}
