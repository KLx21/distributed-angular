const del = require('del');
const gulp = require('gulp');
const gLoadPlugins = require('gulp-load-plugins');
const lodash = require('lodash');
const {rollup} = require('rollup');
const rollupCommonJs = require('@rollup/plugin-commonjs');
const rollupNodeResolve = require('@rollup/plugin-node-resolve').default;
const rollupSourcemaps = require('rollup-plugin-sourcemaps');
const rollupTerser = require('rollup-plugin-terser');
const gDebug = require('gulp-debug');
const merge = require('merge2');

const clientConfig = require('./client.config');
const utils = require('./gulp-utils');
const pkg = require('./package.json');

const moduleNames = clientConfig.moduleNames;
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
  cleanTmpNgDependencies,
  cleanServer
);

const transpileClient = gulp.series(
  cleanTmpTranspiledClient,
  doTsLintClient,
  doTranspileClient
);

const bundleApp = gulp.series(
  cleanTmpCoreBundle,
  transpileClient,
  doBundleApp,
  removeSourceFiles
);

const bundleRxjsOperators = gulp.series(
  cleanTmpRxjsOperatorsBundle,
  doBundleRxjsOperators
);

const copyDependencies = gulp.series(
  cleanTmpVendor,
  copyVendors
);

const prepareNgFiles = gulp.series(
  bundleApp,
  bundleRxjsOperators,
  copyDependencies,
  copyPrerequisites
);

const injectIndexHtml = gulp.series(
  prepareNgFiles,
  doStaticResourceInjection
);

const distUi = gulp.series(
  injectIndexHtml,
  doDistUiFiles
);

const npmInstall = gulp.series(
  copyPackageJson,
  doNpmInstall
);

const distServer = gulp.series(
  cleanServer,
  gulp.parallel(
    npmInstall,
    doDistServerFiles
  )
);

/* Exported tasks */
lodash.assign(exports, {
  bundleApp,
  bundleRxjsOperators,
  cleanUpAll,
  copyDependencies,
  dist: gulp.parallel(
    distUi,
    distServer
  ),
  distServer,
  distUi,
  injectIndexHtml,
  npmInstall,
  prepareNgFiles,
  transpileClient
});

/************** Function declarations start from here on **************/

function cleanServer() {
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
    cwd: folders.tmpBundles
  });
}

function cleanTmpDepsBundle() {
  return del([
    fileNames.depsJSFile,
    fileNames.depsJSFile + '.map',
    fileNames.minDepsJSFile,
    fileNames.minDepsJSFile + '.map'
  ], {
    cwd: folders.tmpBundles
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
    ...filePaths.ngDepsToCopy
  ], {
    cwd: folders.tmp
  });
}

function cleanTmpRxjsOperatorsBundle() {
  return del([
    fileNames.rxjsOperatorsJsFile,
    fileNames.rxjsOperatorsJsFile + '.map',
    fileNames.minRxjsOperatorsJsFile,
    fileNames.minRxjsOperatorsJsFile + '.map'
  ], {
    cwd: folders.tmpBundles
  });
}

/*
* Remove the "client" folder from the "tmp" folder. This "client" folder is for containing all JavaScript files that
* are transpiled from the Typescript source code.
*/
function cleanTmpTranspiledClient() {
  return del(folders.tmpTranspiled);
}

function cleanTmpVendor() {
  return del(folders.tmpVendor);
}

function constructImportmaps() {
  const aScriptTagForImportmaps = [
    '<script type="systemjs-importmap">',
    '</script>'
  ];
  const oImportmaps = {
    imports: {
      [moduleNames.core]: `${ singleFolderNames.bundles }/${ utils.inProduction() ? fileNames.minCoreJSFile : fileNames.coreJSFile }`,
      '@angular/core': `${ singleFolderNames.vendor }/@angular/core/bundles/core.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@angular/common': `${ singleFolderNames.vendor }/@angular/common/bundles/common.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@angular/common/http': `${ singleFolderNames.vendor }/@angular/common/bundles/common-http.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@angular/router': `${ singleFolderNames.vendor }/@angular/router/bundles/router.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@angular/compiler': `${ singleFolderNames.vendor }/@angular/compiler/bundles/compiler.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@angular/forms': `${ singleFolderNames.vendor }/@angular/forms/bundles/forms.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@angular/platform-browser': `${ singleFolderNames.vendor }/@angular/platform-browser/bundles/platform-browser.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@angular/platform-browser-dynamic': `${ singleFolderNames.vendor }/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@ngx-translate/core': `${ singleFolderNames.vendor }/@ngx-translate/core/bundles/ngx-translate-core.umd${ utils.inProduction() ? '.min' : '' }.js`,
      '@ngx-translate/http-loader': `${ singleFolderNames.vendor }/@ngx-translate/http-loader/bundles/ngx-translate-http-loader.umd${ utils.inProduction() ? '.min' : '' }.js`,
      'rxjs': `${ singleFolderNames.vendor }/rxjs/bundles/rxjs.umd${ utils.inProduction() ? '.min' : '' }.js`,
      'rxjs/operators': `${ singleFolderNames.bundles }/${ utils.inProduction() ? fileNames.minRxjsOperatorsJsFile : fileNames.rxjsOperatorsJsFile }`
    }
  };

  aScriptTagForImportmaps.splice(1, 0, JSON.stringify(oImportmaps))

  return aScriptTagForImportmaps.join('');
}

function copyVendors() {
  return gulp
    .src(lodash.map(filePaths.ngDepsToCopy, path => `${ path }/**/*`), {
      base: folders.nodeModulesPrefix,
      cwd: folders.nodeModulesPrefix
    })
    .pipe(gulp.dest(folders.tmpVendor));
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
    .src([
      ...filePaths.prerequisiteCSSFiles,
      ...filePaths.prerequisiteFontFiles,
      ...filePaths.prerequisiteJSFiles,
      ...filePaths.prerequisiteSourcemapFiles
    ], {
      base: folders.nodeModulesPrefix,
      cwd: folders.nodeModulesPrefix
    })
    .pipe(gulp.dest(folders.tmpPrereq));
}

function doDistServerFiles() {
  return gulp
    .src('*', {
      base: folders.projectRoot,
      cwd: folders.server
    })
    .pipe(gulp.dest(folders.dist));
}

function doDistUiFiles() {
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
  const outputOptions = {
    format: 'systemjs',
    sourcemap: true
  };

  return rollup({
    input: `${ folders.tmpTranspiled }/main.js`,
    plugins: [
      rollupSourcemaps(),
      rollupNodeResolve(),
      rollupCommonJs()
    ],
    external: id => lodash.includes(id, 'node_modules') || !/^\.?\.?\//.test(id),
    treeshake: false
  })
    .then(bundle => Promise.all([
      bundle.write(lodash.assign({}, outputOptions, {
        file: `${ folders.tmpBundles }/${ fileNames.coreJSFile }`
      })),
      bundle.write(lodash.assign({}, outputOptions, {
        compact: true,
        file: `${ folders.tmpBundles }/${ fileNames.minCoreJSFile }`,
        plugins: [
          rollupTerser.terser()
        ]
      }))
    ]))
    .catch(utils.onError);
}

function doBundleRxjsOperators() {
  const outputOptions = {
    format: 'umd',
    name: 'rxjs-operators',
    sourcemap: true
  };

  return rollup({
    input: `${ folders.nodeModulesPrefix }/rxjs/operators/index.js`,
    plugins: [
      rollupSourcemaps(),
      rollupNodeResolve(),
      rollupCommonJs()
    ],
    treeshake: false
  })
    .then(builder => {
      return Promise.all([
        builder.write(lodash.assign({}, outputOptions, {
          file: `${ folders.tmpBundles }/${ fileNames.rxjsOperatorsJsFile }`
        })),
        builder.write(lodash.assign({}, outputOptions, {
          file: `${ folders.tmpBundles }/${ fileNames.minRxjsOperatorsJsFile }`,
          plugins: [
            rollupTerser.terser()
          ]
        }))
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
    .src(filePaths.ngCoreSrcTSFiles, {
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
    .src(filePaths.ngCoreSrcTSFiles, {
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
  const prerequisiteCssFileStream = utils.createFilesStream(
    filePaths.prerequisiteCSSFiles,
    folders.tmpPrereq
  );
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
      '<!-- importmaps:json -->',
      constructImportmaps()
    ))
    .pipe(gPlugins.inject(prerequisiteCssFileStream, {
      name: 'prerequisite',
      relative: true
    }))
    .pipe(gPlugins.inject(prerequisiteJsFileStream, {
      name: 'prerequisite',
      relative: true
    }))
    .pipe(gPlugins.injectString.replace(
      '<!-- entry-point:js -->',
      `<script type="text/javascript">System.import('${ moduleNames.core }')</script>`
    ))
    .pipe(gulp.dest(folders.tmp));
}

function removeSourceFiles() {
  return del(folders.tmpTranspiled);
}
