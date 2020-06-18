const path = require('path');

(
  function () {

    // eslint-disable-next-line no-undef
    const sProjectRoot = path.resolve(__dirname);
    const sTmpFolder = '/tmp';
    const sDistFolder = '/dist';
    const sNgFolder = '/ng';
    const sClientFolder = '/client';
    const sServerFolder = '/server';
    const sSrcFolder = '/src';
    const sAppFolder = '/app';
    const sAssetFolder = '/assets';
    const sCSSFolder = '/css';
    const sFontsFolder = '/fonts';
    const sImageFolder = '/img';
    const sJsFolder = '/js';
    const sBundlesFolder = '/bundles';
    const sFontAwesome = '/fa';
    const sLocales = '/locales';
    const sPrereq = '/prereq';
    const sLibs = '/libs';
    const sAtTci = '/@tci';
    const sExtraDepsFolder = '/extra-deps';
    const sVendorFolder = '/vendor';
    const sNodeModulesFolder = '/node_modules';
    const sNgStylesFileBaseName = 'tci-webserver';
    const sPackageJson = '/package.json';

    module.exports = {
      moduleNames: {
        'core': 'da-core'
      },
      singleFolderNames: {
        bundles: sBundlesFolder,
        js: sJsFolder,
        src: sSrcFolder,
        ng: sNgFolder,
        fonts: sFontsFolder,
        tmp: sTmpFolder,
        dist: sDistFolder,
        vendor: sVendorFolder
      },
      folders: {
        projectRoot: sProjectRoot,
        server: sProjectRoot + sServerFolder,
        client: sProjectRoot + sClientFolder,
        tmp: sProjectRoot + sTmpFolder,
        tmpNg: sProjectRoot + sTmpFolder + sNgFolder,
        tmpExtraDeps: sProjectRoot + sTmpFolder + sExtraDepsFolder,
        tmpTranspiled: sProjectRoot + sTmpFolder + sSrcFolder,
        tmpLocales: sProjectRoot + sTmpFolder + sLocales,
        tmpAssets: sProjectRoot + sTmpFolder + sAssetFolder,
        tmpCSS: sProjectRoot + sTmpFolder + sAssetFolder + sCSSFolder,
        tmpImages: sProjectRoot + sTmpFolder + sAssetFolder + sImageFolder,
        tmpBundles: sProjectRoot + sTmpFolder + sBundlesFolder,
        tmpFonts: sProjectRoot + sTmpFolder + sAssetFolder + sFontsFolder,
        tmpFa: sProjectRoot + sTmpFolder + sAssetFolder + sFontAwesome,
        tmpPrereq: sProjectRoot + sTmpFolder + sPrereq,
        tmpLibs: sProjectRoot + sTmpFolder + sLibs,
        tmpAtTci: sProjectRoot + sTmpFolder + sLibs + sAtTci,
        tmpVendor: sProjectRoot + sTmpFolder + sVendorFolder,
        dist: sProjectRoot + sDistFolder,
        distClient: sProjectRoot + sDistFolder + sClientFolder,
        distClientAssets: sProjectRoot + sDistFolder + sClientFolder + sAssetFolder,
        distServer: sProjectRoot + sDistFolder + sServerFolder,
        srcClient: sProjectRoot + sClientFolder + sSrcFolder,
        srcApp: sProjectRoot + sClientFolder + sClientFolder + sAppFolder,
        extraDeps: sProjectRoot + sClientFolder + sExtraDepsFolder,
        nodeModulesPrefix: sProjectRoot + sNodeModulesFolder
      },
      fileNames: {
        packageJson: 'package.json',
        lessFile: sNgStylesFileBaseName + '.less',
        scssFile: sNgStylesFileBaseName + '.scss',
        cssFile: sNgStylesFileBaseName + '.css',
        depsJSFile: 'deps.bundle.js',
        testingDepsJSFile: 'testing-deps.bundle.js',
        globalRxJsFile: 'global-rxjs.bundle.js',
        rxjsOperatorsJsFile: 'rxjs-operators.bundle.js',
        coreJSFile: 'da-core.bundle.js',
        tenantJSFile: 'tenant-*.umd.js',
        minCSSFile: sNgStylesFileBaseName + '.min.css',
        minExtraDepsJSFile: 'extra-deps.min.js',
        minExtraDepsCSSFile: 'extra-deps.min.css',
        minDepsJSFile: 'deps.bundle.min.js',
        minTestingDepsJSFile: 'testing-deps.bundle.min.js',
        minGlobalRxJsFile: 'global-rxjs.bundle.min.js',
        minRxjsOperatorsJsFile: 'rxjs-operators.bundle.min.js',
        minCoreJSFile: 'core.bundle.umd.min.js',
        minTenantJSFile: 'tenant-*.umd.min.js',
        minPrerequisiteJSFile: 'prereq.min.js',
        minPrerequisiteCSSFile: 'prereq.min.css',
        apiLicenseFile: 'license.txt',
        moduleConfig: 'moduleConfig'
      },
      /**
       * 'filepaths' contains all the glob strings used in all the Gulp tasks. The order should NOT be changed
       * randomly. Refer to https://github.com/isaacs/node-glob for the more information about glob strings.
       */
      filePaths: {
        srcPackageJson: sProjectRoot + sPackageJson,
        prerequisiteJSFiles: [
          'jquery/dist/jquery.min.js',
          // 'jquery-migrate/dist/jquery-migrate.min.js',
          'bootstrap/dist/js/bootstrap.min.js',
          'lodash/lodash.min.js',
          'reflect-metadata/Reflect.js',
          'zone.js/dist/zone.min.js',
          'systemjs/dist/system.min.js',
          'systemjs/dist/extras/amd.min.js',
          'systemjs/dist/extras/named-exports.min.js'
        ],
        prerequisiteSourcemapFiles: [
          'bootstrap/dist/js/bootstrap.min.js.map',
          'bootstrap/dist/css/bootstrap.min.css.map',
          'jquery/dist/jquery.min.map',
          'systemjs/dist/system.min.js.map',
          'systemjs/dist/extras/amd.min.js.map',
          'systemjs/dist/extras/named-exports.min.js.map'
        ],
        prerequisiteCSSFiles: [
          'bootstrap/dist/css/bootstrap.min.css',
          'font-awesome/css/font-awesome.min.css'
        ],
        prerequisiteFontFiles: [
          'font-awesome/fonts/*'
        ],
        srcLESSFiles: [
          '**/*.variables.less',
          '**/*.mixins.less',
          '**/*.less'
        ],
        srcExcludedLESSFiles: [
          '!variables.less',
          '!mixins.less',
          '!tcc.original.less'
        ],
        srcImageFiles: [
          'app/**/img/*.+(jpg|jpeg|png|svg|gif|ico)',
          'assets/img/*.+(jpg|jpeg|png|svg|gif|ico)'
        ],
        srcLangFiles: 'app/**/*.lang.json',
        ngCoreSrcTSFiles: [
          '**/*.ts',
          '!environments/*',
          '!**/*.spec.ts'
        ],
        ngSrcScssFile: [
          '**/*.scss',
          '!assets/**/*.scss'
        ],
        ngSrcLESSFiles: [
          '**/*.less',
          '!assets/**/*.less'
        ],
        ngBundledFiles: '*.bundle?(.min).js?(.map)',
        ngDepsToCopy: [
          '@angular',
          '@ngx-translate',
          'bootstrap',
          'rxjs',
          'systemjs-plugin-css'
        ]
      }
    };
  }
)();
