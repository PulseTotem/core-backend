
module.exports = function (grunt) {
    'use strict';

    // load extern tasks
    grunt.loadNpmTasks('grunt-update-json');
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-bumpup');

    // tasks
    grunt.initConfig({

// ---------------------------------------------
//                               configure tasks
// ---------------------------------------------
        coreReposConfig : grunt.file.readJSON('core-repos-config.json'),

        symlink: {
            // Enable overwrite to delete symlinks before recreating them
            options: {
                overwrite: true
            },
            // The "build/target.txt" symlink will be created and linked to
            // "source/target.txt". It should appear like this in a file listing:
            // build/target.txt -> ../source/target.txt
            coreBackend: {
                src: '<%= coreReposConfig.coreRepoPath %>',
                dest: 't6s-core/core'
            }
        },

        update_json: {
            packageBuild: {
                src: ['t6s-core/core/package.json', 'package.json'],
                dest: 'package-tmp.json',
                fields: [
                    'name',
                    'version',
                    'dependencies',
                    'devDependencies',
                    'overrides'
                ]
            }
        },

// ---------------------------------------------

// ---------------------------------------------
//                          build and dist tasks
// ---------------------------------------------
        copy: {
            buildPackageBak: {
                files: 	[{'package-bak.json': 'package.json'}]
            },
            buildPackageReplace: {
                files: 	[{'package.json': 'package-tmp.json'}]
            },
            buildPackageReinit: {
                files: 	[{'package.json': 'package-bak.json'}]
            }
        },

        typescript: {
            build: {
                src: [
                    'scripts/**/*.ts'
                ],
                dest: 'build/js/CoreBackend.js'
            },
            test: {
                src: [
                    'tests/**/*.ts'
                ],
                dest: 'build/tests/Test.js'
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 doc tasks
// ---------------------------------------------
        yuidoc: {
            compile: {
                name: 'The 6th Screen - Core-backend',
                description: 'Core-Backend module for The 6th Screen products.',
                version: '0.0.1',
                url: 'http://www.the6thscreen.fr',
                options: {
                    extension: '.ts, .js',
                    paths: ['scripts/'],
                    outdir: 'doc/'
                }
            }
        },
// ---------------------------------------------

// ---------------------------------------------
//                                 test tasks
// ---------------------------------------------
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    colors: true,
                    captureFile: 'build/tests/result.txt'
                },
                src: ['build/tests/Test.js']
            },
            jenkins: {
                options: {
                    reporter: 'mocha-jenkins-reporter',
                    quiet: true,
                    reporterOptions: {
                        "junit_report_name": "Tests",
                        "junit_report_path": "build/tests/report.xml",
                        "junit_report_stack": 1
                    }
                },
                src: ['build/tests/Test.js']
            }
        },

        mocha_istanbul: {
            coverage: {
                src: 'build/tests/', // a folder works nicely
                options: {
                    mask: '*.js',
                    root: 'build/tests/',
                    reportFormats: ['cobertura', 'html'],
                    coverageFolder: 'build/coverage'
                }
            },
        },
// ---------------------------------------------

// ---------------------------------------------
//                                    clean task
// ---------------------------------------------
        clean: {
            package: ['package-bak.json', 'package-tmp.json'],
            build: ['build/'],
            doc: ['doc'],
            test: ['build/tests/', 'build/coverage/']
        },
// ---------------------------------------------

// ---------------------------------------------
//                                    bump task
// ---------------------------------------------
      bumpup: 'package.json'
// ---------------------------------------------
    });

    grunt.registerTask('default', ['test']);
    grunt.registerTask('init', ['symlink']);

    grunt.registerTask('doc', ['clean:doc', 'yuidoc']);

    grunt.registerTask('initTest', function() {
        grunt.task.run(['clean:build']);

        grunt.task.run(['update_json:packageBuild', 'copy:buildPackageBak', 'copy:buildPackageReplace', 'npm-install', 'copy:buildPackageReinit', 'typescript:build', 'typescript:test']);
    });


    grunt.registerTask('coverage', ['initTest', 'mocha_istanbul:coverage']);
    grunt.registerTask('test', ['initTest', 'mochaTest:test']);

    grunt.registerTask('jenkins', ['initTest', 'mochaTest:jenkins', 'mocha_istanbul:coverage', 'clean:package']);

}

