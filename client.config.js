const path = require('path');

(function () {

    // eslint-disable-next-line no-undef
    const sProjectRoot = path.resolve(__dirname);
    const sTmpFolder = sProjectRoot + '/tmp';
    const sDistFolder = sProjectRoot + '/dist';
    const sNg2Folder = '/ng2';
    const sClientFolder = '/client';
    const sServerFolder = '/server';
    const sSrcFolder = '/src';
    const sAppFolder = '/app';
    const sAssetFolder = '/assets';
    const sCSSFolder = '/css';
    const sFontsFolder = '/fonts';
    const sImageFolder = '/img';
    const sJsFolder = '/js';
    const sFontAwesome = '/fa';
    const sLocales = '/locales';
    const sLibs = '/libs';
    const sAtTci = '/@tci';
    const sExtraDepsFolder = '/extra-deps';
    const sVendorTargetFolder = '/vendor';
    const sNodeModulesFolder = '/node_modules';
    const sNgStylesFileBaseName = 'tci-webserver';
    const sPackageJson = '/package.json';

    module.exports = {
        singleFolderNames: {
            js: sJsFolder
        },
        folders: {
            projectRoot: sProjectRoot,
            server: sProjectRoot + sServerFolder,
            client: sProjectRoot + sClientFolder,
            src: sSrcFolder,
            ng2: sNg2Folder,
            fonts: sFontsFolder,
            tmp: sTmpFolder,
            tmpNg2: sTmpFolder + sNg2Folder,
            tmpExtraDeps: sTmpFolder + sExtraDepsFolder,
            tmpTranspiled: sTmpFolder + sSrcFolder,
            tmpLocales: sTmpFolder + sLocales,
            tmpAssets: sTmpFolder + sAssetFolder,
            tmpCSS: sTmpFolder + sAssetFolder + sCSSFolder,
            tmpImages: sTmpFolder + sAssetFolder + sImageFolder,
            tmpJs: sTmpFolder + sJsFolder,
            tmpFonts: sTmpFolder + sAssetFolder + sFontsFolder,
            tmpFA: sTmpFolder + sAssetFolder + sFontAwesome,
            tmpPrereq: sTmpFolder + '/prereq',
            tmpLibs: sTmpFolder + sLibs,
            tmpAtTci: sTmpFolder + sLibs + sAtTci,
            dist: sDistFolder,
            distClient: sDistFolder + sClientFolder,
            distClientAssets: sDistFolder + sClientFolder + sAssetFolder,
            distServer: sDistFolder + sServerFolder,
            srcClient: sProjectRoot + sClientFolder + sSrcFolder,
            srcApp: sProjectRoot + sClientFolder + sClientFolder + sAppFolder,
            extraDeps: sProjectRoot + sClientFolder + sExtraDepsFolder,
            ng2ClientVendor: sProjectRoot + sClientFolder + sVendorTargetFolder,
            nodeModulesPrefix: sProjectRoot + sNodeModulesFolder
        },
        fileNames: {
            packageJson: 'package.json',
            lessFile: sNgStylesFileBaseName + '.less',
            cssFile: sNgStylesFileBaseName + '.css',
            depsJSFile: 'tci-deps.bundle.js',
            testingDepsJSFile: 'tci-testing-deps.bundle.js',
            globalRxJsFile: 'global-rxjs.bundle.js',
            coreJSFile: 'tci-core.bundle.umd.js',
            tenantJSFile: 'tci-tenant-*.umd.js',
            minCSSFile: sNgStylesFileBaseName + '.min.css',
            minExtraDepsJSFile: 'extra-deps.min.js',
            minExtraDepsCSSFile: 'extra-deps.min.css',
            minDepsJSFile: 'tci-deps.bundle.min.js',
            minTestingDepsJSFile: 'tci-testing-deps.bundle.min.js',
            minGlobalRxJsFile: 'global-rxjs.bundle.min.js',
            minCoreJSFile: 'tci-core.bundle.umd.min.js',
            minTenantJSFile: 'tci-tenant-*.umd.min.js',
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
                'jquery-migrate/dist/jquery-migrate.min.js',
                'bootstrap/dist/js/bootstrap.min.js',
                'lodash/lodash.min.js',
                'zone.js/dist/zone.min.js',
                'reflect-metadata/Reflect.js',
                'systemjs/dist/system.js'
                // 'systemjs/dist/system-node.cjs'
                // 'swagger-ui-dist/swagger-ui-bundle.js',
                // 'swagger-ui-dist/swagger-ui-standalone-preset.js'
            ],
            prerequisiteSourcemapFiles: [
                'bootstrap/dist/css/bootstrap.min.css.map',
                'jquery/dist/jquery.min.map',
                'reflect-metadata/Reflect.js.map',
                'systemjs/dist/system.js.map'
                // 'swagger-ui-dist/swagger-ui.css.map',
                // 'swagger-ui-dist/swagger-ui-bundle.js.map',
                // 'swagger-ui-dist/swagger-ui-standalone-preset.js.map'
            ],
            prerequisiteCSSFiles: [
                'bootstrap/dist/css/bootstrap.min.css',
                'font-awesome/css/font-awesome.min.css',
                // 'swagger-ui-dist/swagger-ui.css'
                // 'swagger-ui-themes/themes/3.x/*.css'
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
                // '!*.component.less'
            ],
            srcImageFiles: [
                'app/**/img/*.+(jpg|jpeg|png|svg|gif|ico)',
                'assets/img/*.+(jpg|jpeg|png|svg|gif|ico)'
            ],
            srcLangFiles: 'app/**/*.lang.json',
            extraDepsJSFiles: [
                'gnb/*.js'
            ],
            extraDepsCSSFiles: [
                'gnb/*.css'
            ],
            extraDepsSourcemapFiles: [],
            ng2VendorDepsToCopy: [
                'gnb'
            ],
            ng2CoreSrcTSFiles: [
                '**/*.ts',
                '!environments/*',
                '!**/*.spec.ts'
            ],
            ng2TenantSrcTSFiles: [
                'app/ng-tenant/node/**/*.ts',
            ],
            ng2SrcSpecTSFiles: [
                '**/*.spec.ts'
            ],
            ngSrcScssFile: [
              '**/*.scss',
              '!assets/**/*.scss'
            ],
            ng2SrcLESSFiles: [
                '**/*.less',
                // '!**/*.component.less',
                '!assets/**/*.less'
            ],
            ng2BundledFiles: '*.bundle?(.min).js?(.map)',
            ng2DepsToCopy: [
                '@angular',
                '@ngx-translate',
                'ag-grid',
                'ag-grid-angular',
                // ...ngxD3V4Chartlibs,
                'd3',
                'angular-2-local-storage',
                'angular-in-memory-web-api',
                'angular2-cookie',
                'core-js',
                'crypto-js',
                'jstimezonedetect',
                'lodash',
                'ng2-translate',
                'ngx-clipboard',
                'ngx-file-drop',
                'ngx-toastr',
                'ngx-perfect-scrollbar',
                'perfect-scrollbar',
                'primeng',
                'jstz',
                'rxjs',
                'systemjs-plugin-css',
                'zone.js'
            ],
            ng2DepsBundle: [
                '@angular/core/*',
                '@angular/common/*',
                '@angular/compiler/*',
                '@angular/platform-browser/*',
                '@angular/platform-browser-dynamic/*',
                '@angular/http/*',
                '@angular/router/*',
                '@angular/router/upgrade/*',
                '@angular/forms/*',
                '@angular/upgrade/*',
                '@angular/upgrade/static/*',
                '@ngx-translate/*',
                'ag-grid/*',
                'ag-grid-angular/*',
                'angular-2-local-storage/*',
                'angular-in-memory-web-api/*',
                'angular2-cookie/*',
                'core-js/*',
                'crypto-js/*',
                'jstimezonedetect/*',
                'lodash/*',
                'ng2-translate/*',
                'ngx-clipboard/*',
                'ngx-file-drop/*',
                'd3/*',
                'd3-array/*',
                'd3-drag/*',
                'd3-axis/*',
                'd3-chord/*',
                'd3-collection/*',
                'd3-color/*',
                'd3-dsv/*',
                'd3-ease/*',
                'd3-force/*',
                'd3-format/*',
                'd3-geo/*',
                'd3-interpolate/*',
                'd3-path/*',
                'd3-polygon/*',
                'd3-quadtree/*',
                'd3-queue/*',
                'd3-random/*',
                'd3-request/*',
                'd3-scale/*',
                'd3-selection/*',
                'd3-shape/*',
                'd3-time/*',
                'd3-time-format/*',
                'd3-timer/*',
                'd3-transition/*',
                'd3-voronoi/*',
                'd3-zoom/*',
                'd3-brush/*',
                'd3-dispatch/*',
                'd3-hierarchy/*',
                'ngx-toastr/*',
                'ngx-perfect-scrollbar/*',
                'perfect-scrollbar/*',
                'primeng/*',
                'jstz/*',
                'rxjs/*',
                'systemjs-plugin-css/*',
                'zone.js/*'
            ],
            ng2TestingDepsBundle: [
                '@angular/core/testing/*',
                '@angular/common/testing/*',
                '@angular/compiler/testing/*',
                '@angular/platform-browser/testing/*',
                '@angular/platform-browser-dynamic/testing/*',
                '@angular/http/testing/*',
                '@angular/router/testing/*'
            ]
        }
    };
})();
