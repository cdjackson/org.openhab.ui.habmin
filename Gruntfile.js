module.exports = function (grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-json-minify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-bootlint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-lesslint');
    grunt.loadNpmTasks('grunt-string-replace');

    /**
     * Load in our build configuration file.
     */
    var userConfig = require('./build.config.js');

    var pkg = grunt.file.readJSON("package.json");

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {
        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
         * The banner is the comment that is placed at the top of our compiled
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner: '/**\n' +
            ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' *\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
            ' */\n'
        },

        /**
         * Creates a changelog on a new version.
         */
        changelog: {
            options: {
                dest: 'CHANGELOG.md',
                template: 'changelog.tpl'
            }
        },

        /**
         * Increments the version number, etc.
         */
        bump: {
            options: {
                files: [
                    "package.json",
                    "bower.json"
                ],
                commit: false,
                commitMessage: 'chore(release): v%VERSION%',
                commitFiles: [
                    "-a"
                ],
                createTag: false,
                tagName: 'v%VERSION%',
                tagMessage: 'Version ' + grunt.config("setversion"),
                push: false,
                pushTo: 'origin'
            }
        },

        /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            init: [
                '<%= build_dir %>',
                '<%= compile_dir %>',
                '<%= cordova_dir %>/www',
                '<%= output_dir %>',
                '<%= bundle_dir %>'
            ],
            css: {
                src: '<%= compile_dir %>/assets/<%= pkg.name %>-*-<%= pkg.version %>.css'
            },
            changelog: {
                src: 'CHANGELOG.md'
            },
            jar_final: {
                src: '<%= bundle_dir %>'
            }
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {
            build_app_assets: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= build_dir %>/assets/',
                        cwd: 'src/web/assets',
                        expand: true
                    }
                ]
            },
            build_app_languages: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= build_dir %>/languages/',
                        cwd: 'src/web/languages',
                        expand: true
                    }
                ]
            },
            build_vendor_assets: {
                files: [
                    {
                        src: ['<%= vendor_files.assets %>'],
                        dest: '<%= build_dir %>/assets/',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            build_appjs: {
                files: [
                    {
                        src: ['<%= app_files.js %>'],
                        dest: '<%= build_dir %>/',
                        cwd: 'src/web',
                        expand: true
                    }
                ]
            },
            build_vendorjs: {
                files: [
                    {
                        src: ['<%= vendor_files.js %>'],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            build_vendorcss: {
                files: [
                    {
                        src: ['<%= vendor_files.css %>'],
                        dest: '<%= build_dir %>/assets',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            compile_assets: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= compile_dir %>/assets',
                        cwd: '<%= build_dir %>/assets',
                        expand: true
                    }
                ]
            },
            compile_languages: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= compile_dir %>/languages/',
                        cwd: '<%= build_dir %>/languages',
                        expand: true
                    }
                ]
            },
            cordova_build: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= cordova_dir %>/www/',
                        cwd: '<%= build_dir %>',
                        expand: true
                    }
                ]
            },
            cordova_compile: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= cordova_dir %>/www/',
                        cwd: '<%= compile_dir %>',
                        expand: true
                    }
                ]
            },
            cordova_android: {
                files: [
                    {
                        src: ['<%= cordova_dir %>/platforms/android/ant-build/CordovaApp-debug.apk'],
                        dest: '<%= output_dir %>/<%= pkg.name %>-<%= pkg.version %>.apk',
                        cwd: '.'
                    }
                ]
            },
            jar_debug: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= bundle_dir %>',
                        cwd: '<%= build_dir %>',
                        expand: true
                    }
                ]
            },
            jar_final: {
                files: [
                    {
                        src: ['**'],
                        dest: '<%= bundle_dir %>',
                        cwd: '<%= compile_dir %>',
                        expand: true
                    }
                ]
            }
        },

        /**
         * Combine and minify all CSS
         */
        cssmin: {
            target: {
                options: {
                    // The following lines may be useful for debugging if there are problems with the minification
                    //                    keepBreaks: true,
                    //                    aggressiveMerging: false
                },
                files: [{
                    src: [
                        '<%= vendor_files.css %>',
                        '<%= build_dir %>/assets/<%= pkg.name %>-*-<%= pkg.version %>.css'
                    ],
                    dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                }]
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {
            /**
             * The `build_css` target concatenates compiled CSS and vendor CSS
             * together.
             */
            build_css: {
                src: [
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-*-<%= pkg.version %>.css'
                ],
                dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
            },
            /**
             * The `compile_js` target is the concatenation of our application source
             * code and all specified vendor source code into a single file.
             */
            compile_js: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    '<%= vendor_files.js %>',
                    'module.prefix',
                    '<%= build_dir %>/src/**/*.js',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        /**
         * `ng-annotate` annotates the sources before minifying. That is, it allows us
         * to code without the array syntax.
         */
        ngAnnotate: {
            compile: {
                files: [
                    {
                        src: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
                    }
                ]
            }
        },

        /**
         * `json-min`  minifys the json language files
         */
        'json-minify': {
            build: {
                files: '<%= compile_dir %>/languages/*/**.*.json'
            }
        },

        /**
         * Minify the sources!
         */
        uglify: {
            compile: {
                options: {
                    banner: '<%= meta.banner %>',
                    ASCIIOnly: true,
                    preserveComments: false,
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            }
        },

        /**
         * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
         */
        less: {
            main: {
                files: {
                    '<%= build_dir %>/assets/<%= pkg.name %>.css': '<%= app_files.less %>'
                }
            }
        },

        /**
         * Check our LESS files
         */
        lesslint: {
            src: ['src/**/*.less']
        },

        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our unit tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        jshint: {
            src: [
                '<%= app_files.js %>'
            ],
            test: [
                '<%= app_files.jsunit %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true
            },
            globals: {}
        },

        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            /**
             * These are the templates from `src/app`.
             */
            app: {
                options: {
                    base: 'src/web/app',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeCommentsFromCDATA: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                },
                src: ['<%= app_files.atpl %>'],
                dest: '<%= build_dir %>/templates-app.js'
            },

            /**
             * These are the templates from `src/common`.
             */
            common: {
                options: {
                    base: 'src/common',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                },
                src: ['<%= app_files.ctpl %>'],
                dest: '<%= build_dir %>/templates-common.js'
            }
        },

        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: '<%= build_dir %>/karma.conf.js'
            },
            unit: {
                port: 9876,
                background: true
            },
            continuous: {
                singleRun: true
            }
        },

        /**
         * The `index` task compiles the `index.html` file as a Grunt template. CSS
         * and JS files co-exist here but they get split apart later.
         */
        index: {
            /**
             * During development, we don't want to have wait for compilation,
             * concatenation, minification, etc. So to avoid these steps, we simply
             * add all script files directly to the `<head>` of `index.html`. The
             * `src` property contains the list of included files.
             */
            build: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= build_dir %>/**/*.js',
                    '<%= html2js.common.dest %>',
                    '<%= html2js.app.dest %>',
                    '<%= build_dir %>/assets/**/*.css',
                    '<%= build_dir %>/assets/<%= pkg.name %>-*-<%= pkg.version %>.css'
                ],
                build: 'browser'
            },

            cordova: {
                dir: '<%= cordova_dir %>/www',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= build_dir %>/src/**/*.js',
                    '<%= html2js.common.dest %>',
                    '<%= html2js.app.dest %>',
                    '<%= build_dir %>/assets/**/*.css',
                    '<%= build_dir %>/assets/<%= pkg.name %>-*-<%= pkg.version %>.css'
                ],
                build: 'cordova'
            },

            /**
             * When it is time to have a completely compiled application, we can
             * alter the above to include only a single JavaScript and a single CSS
             * file. Now we're back!
             */
            compile: {
                dir: '<%= compile_dir %>',
                src: [
                    '<%= concat.compile_js.dest %>',
                    '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                build: 'browser'
            }
        },

        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         */
        karmaconfig: {
            unit: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= html2js.app.dest %>',
                    '<%= html2js.common.dest %>',
                    '<%= test_files.js %>'
                ]
            }
        },

         /**
         * Check that our Bootstrap templates are ok
         */
        bootlint: {
            options: {
                stoponerror: false,
                relaxerror: [
                    "W001",
                    "W002",
                    "W003",
                    "W005",
                    "E001"
                ]
            },
            files: ['<%= app_files.atpl %>']
        },

        /**
         * Minify the index html file
         */
        htmlmin: {
            compile: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        src: '<%= compile_dir %>/index.html',
                        dest: '<%= compile_dir %>/index.html'
                    }
                ]
            }
        },

        /**
         * Compress the output
         */
        compress: {
            debug: {
                options: {
                    archive: '<%= output_dir %>/<%= pkg.name %>-<%= pkg.version %>-debug.zip'
                },
                files: [
                    {expand: true, cwd: '<%= build_dir %>', src: ['**']}
                ]
            },
            release: {
                options: {
                    archive: '<%= output_dir %>/<%= pkg.name %>-<%= pkg.version %>-release.zip'
                },
                files: [
                    {expand: true, cwd: '<%= compile_dir %>', src: ['**']}
                ]
            }
        },

        /**
         * Shell exec funtions used for compiling Cordova apps
         */
        shell: {
            build_android: {
                options: {
                    execOptions: {
                        cwd: "cordova" //"<%= cordova_dir =>"
                    }
                },
                command: 'phonegap build android'
            }
        },

        /**
         * String Replace functions to update android manifest
         */
        'string-replace': {
            versionCode: { // update the version code stored in package.json
                options: {
                    replacements: [
                        {
                            pattern: /['"]androidVersionCode['"]:.*?['"](\d*)['"]/ig,
                            replacement: function (match, p1, offset, string) {
                                return '"androidVersionCode": "' + (parseInt(p1) + 1) + '"';
                            }
                        }
                    ]
                },
                files: {
                    'package.json': 'package.json'
                }
            },

            androidVersionCode: { // update the version code stored in AndroidManifest.xml
                options: {
                    replacements: [
                        {
                            pattern: /android:versionCode=['"](\d*)['"]/ig,
                            replacement: function (match, p1, offset, string) {
                                var pkg = grunt.file.readJSON('package.json');
                                grunt.log.writeln("pkg.androidVersionCode: " + pkg.androidVersionCode);
                                grunt.log.writeln('Returning: ' + 'android:versionCode="' + pkg.androidVersionCode + '"');
                                return 'android:versionCode="' + pkg.androidVersionCode + '"';
                            }
                        }
                    ]
                },
                files: {
                    'cordova/platforms/android/AndroidManifest.xml': 'cordova/platforms/android/AndroidManifest.xml'
                }
            },
            androidVersionName: { // update the version name stored in AndroidManifest.xml
                options: {
                    replacements: [
                        {
                            pattern: /android:versionName=['"](\d.*)['"]/ig,
                            replacement: function (match, p1, offset, string) {
                                var pkg = grunt.file.readJSON('package.json');
                                return 'android:versionName="' + pkg.version + '"';
                            }
                        }
                    ]
                },
                files: {
                    'cordova/platforms/android/AndroidManifest.xml': 'cordova/platforms/android/AndroidManifest.xml'
                }
            }
        }
    };

    /**
     * Generate the skins tasks.
     * Maybe this isn't the best way!
     */
    var skinTasksBuild = [];
    var skinTasksCompile = [];
    userConfig.skins.forEach(function (skin) {
        var skin_css = '<%= build_dir %>/assets/<%= pkg.name %>-' + skin + '.css';
        taskConfig.less[skin] = {
            files: {},
            options: {
            }
        };
        taskConfig.less[skin].files[skin_css] = 'src/web/less/skins/' + skin + '.less';
        skinTasksBuild.push('less:' + skin);

//        grunt.log.write(taskConfig.less[skin].files[skin_css]);

        taskConfig.less[skin + '_compile'] = {
            files: {},
            options: {
                cleancss: true,
                compress: true
            }
        };
        taskConfig.less[skin + '_compile'].files[skin_css] = 'src/web/less/skins/<%= skin %>.less';
        skinTasksCompile.push('less:' + skin + '_compile');
    });
    grunt.registerTask('skins_build', skinTasksBuild);
    grunt.registerTask('skins_compile', skinTasksCompile);

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.registerTask('check_languages', 'Check the completeness of translations', function () {
        grunt.file.recurse(userConfig.language_dir + "/en-GB", function (abspath, rootdir, subdir, filename) {
            grunt.log.writeln('Checking "' + filename + '"');
            var baseLanguage = grunt.file.readJSON(abspath);
            userConfig.languages.forEach(function (language) {
                if(language == "en-GB") {
                    return;
                }
                if(grunt.file.exists(userConfig.language_dir + '/' + language + '/' + filename)) {
                    var testLanguage = grunt.file.readJSON(userConfig.language_dir + '/' + language + '/' + filename);
                    var cntTotal = 0;
                    var cntTrans = 0;
                    for (var key in baseLanguage) {
                        cntTotal++;
                        if (testLanguage[key] != null) {
                            cntTrans++;
                        }
                        else if (grunt.option('lang') == language) {
                            grunt.log.errorlns("Missing translation: \"" + key + "\"");
                        }

                    }
                    if (cntTrans == cntTotal) {
                        grunt.log.oklns(language + ': ' + cntTrans + '/' + cntTotal);
                    }
                    else {
                        grunt.log.errorlns(language + ': ' + cntTrans + '/' + cntTotal);
                    }
                }
            });
        });
    });

    /**
     * The default task is to build.
     */
    grunt.registerTask('default', ['build']);

    /**
     * The `build` task gets your app ready to run for development and testing.
     */
    grunt.registerTask('build', [
        'clean:init', 'html2js',
        'copy:build_vendorcss', 'copy:build_app_assets', 'copy:build_app_languages', 'copy:build_vendor_assets',
        'copy:build_appjs', 'copy:build_vendorjs', 'less:main', 'skins_build', 'index:build',
        'copy:jar_debug'
    ]);

    /**
     * The `dev` task builds and tests the app.
     */
    grunt.registerTask('dev', [
        'build', 'jshint', 'bootlint', 'karmaconfig', 'karma:continuous'
    ]);

    /**
     * Phonegap compiler - external...
     */
    grunt.registerTask('mobile', [
        'build', 'build_cordova'
    ]);

    /**
     * Phonegap compiler - internal...
     */
    grunt.registerTask('build_cordova', [
        'copy:cordova_build', 'index:cordova',
        'string-replace:versionCode', 'string-replace:androidVersionCode', 'string-replace:androidVersionName',
        'shell:build_android', 'copy:cordova_android'
    ]);

    /**
     * Phonegap compiler - internal...
     */
    grunt.registerTask('compile_cordova', [
        'copy:cordova_build', 'index:cordova',
        'string-replace:versionCode', 'string-replace:androidVersionCode', 'string-replace:androidVersionName',
        'shell:build_android', 'copy:cordova_android'
    ]);

    /**
     * The `compile` task gets your app ready for deployment by concatenating and
     * minifying your code.
     * It starts
     */
    grunt.registerTask('compile', [
        'check_languages',
        'clean:changelog', 'changelog',
        'build',
        'copy:compile_assets', 'copy:compile_languages', 'clean:css', 'cssmin', 'json-minify',
        'concat:compile_js', 'ngAnnotate', 'uglify', 'index:compile', 'htmlmin:compile',
//        'compress',
//        'clean:jar_final', 'copy:jar_final',
//        'compile_cordova'
    ]);

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS(files) {
        return files.filter(function (file) {
            return file.match(/\.css$/);
        });
    }

    /**
     * The index.html template includes the stylesheet and javascript sources
     * based on dynamic names calculated in this Gruntfile. This task assembles
     * the list into variables for the template to use and then runs the
     * compilation.
     */
    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');

        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });
        var cssFilesRaw = filterForCSS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });

        var jsFilesVendor = [];
        var jsFilesApp = [];
        for(var jscnt=0; jscnt < jsFiles.length; jscnt++) {
            if(jsFiles[jscnt].indexOf("vendor/") == 0) {
                jsFilesVendor.push(jsFiles[jscnt]);
            }
            else {
                jsFilesApp.push(jsFiles[jscnt]);
            }
        }

        jsFiles = jsFilesVendor;
        jsFiles = jsFiles.concat(jsFilesApp);

        // Make sure that our main file and skins are last so they over-ride any classes
        var cssFiles = [];
        var cssFilesApp = [];
        for(var csscnt=0; csscnt < cssFilesRaw.length; csscnt++) {
            if(cssFilesRaw[csscnt].indexOf("assets/" + pkg.name + "-skin") == 0) {
                cssFilesApp.push(cssFilesRaw[csscnt]);
            }
            else if(cssFilesRaw[csscnt].indexOf("assets/" + pkg.name) != 0) {
                cssFiles.push(cssFilesRaw[csscnt]);
            }
        }
        cssFiles.push("assets/" + pkg.name + ".css");
        cssFiles.push.apply(cssFiles, cssFilesApp);

        var buildtype = this.data.build;
        grunt.file.copy('src/web/index.html', this.data.dir + '/index.html', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles,
                        version: grunt.config('pkg.version'),
                        buildtype: buildtype,
                        splashScreen: userConfig.splashScreen,
                        navScreen: userConfig.navScreen
                    }
                });
            }
        });
    });

    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
        var jsFiles = filterForJS(this.filesSrc);

        grunt.file.copy('karma/karma.conf.tpl.js', grunt.config('build_dir') + '/karma.conf.js', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });
    });
};
