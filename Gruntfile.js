'use strict';

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist',
        tmp: '.tmp'
    };


    // Project configuration.
    grunt.initConfig({

        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'uncss', 'cssnano']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '<%= config.tmp %>/{,*/}*.css',
                    '<%= config.tmp %>/{,*/}*.js',
                    '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
          dist: {
            files: [{
              dot: true,
              src: [
                '<%= config.tmp %>',
                '<%= config.dist %>/{,*/}*',
                '!<%= config.dist %>/.git*'
              ]
            }]
          },
          server: '<%= config.tmp %>'
        },

        // Automatically inject Bower components into the app
        wiredep: {
          app: {
            src: ['<%= config.app %>/index.html'],
            ignorePath:  /\.\.\//
          }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
          server: [
            'copy:styles'
          ],
          test: [
            'copy:styles'
          ],
          dist: [
            'copy:styles',
            'imagemin',
            'svgmin'
          ]
        },

        // Copies remaining files to places other tasks can use
        copy: {
          dist: {
            files: [{
              expand: true,
              dot: true,
              cwd: '<%= config.app %>',
              dest: '<%= config.dist %>',
              src: [
                '*.{ico,png,txt,php}',
                '.htaccess',
                '*.html',
                'images/{,*/}*.{webp}',
                'styles/fonts/*'
              ]}, {
                expand: true,
                cwd: '<%= config.tmp %>/images',
                dest: '<%= config.dist %>/images',
                src: ['generated/*']
              }
            ],
            options: {
              open: true,
              base: '<%= config.dist %>'
            }
          },
          styles: {
            expand: true,
            cwd: '<%= config.app %>/styles',
            dest: '<%= config.tmp %>/styles/',
            //src: '{,*/}*.css'
            src: '{,*/}*.css'
          }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
          html: '<%= config.app %>/index.html',
          css: '<%= config.tmp %>/styles/*.css',
          options: {
            dest: '<%= config.dist %>',
            flow: {
              html: {
                steps: {
                  js: ['concat', 'uglifyjs'],
                  css: ['concat']
                },
                post: {}
              }
            }
          }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
          html: ['<%= config.dist %>/{,*/}*.html', '<%= config.dist %>/**/*.html', '<%= config.dist %>/**/*.html'],
          js: ['<%= config.dist %>/scripts/{,*/}*.js','<%= config.dist %>/scripts/**/**.js' ],
          css: ['<%= config.tmp %>/styles/{,*/}*.css','<%= config.dist %>/styles/{,*/}*.css'],
          options: {
            assetsDirs: ['<%= config.dist %>','<%= config.dist %>/images'],
            patterns: {
              js: [
                  [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
              ],
              css: [
                  [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the CSS to reference our revved images']
              ]
            }
          }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
          options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
          },
          all: {
            src: [
              'Gruntfile.js',
              '<%= config.app %>/scripts/{,*/}*.js'
            ]
          }
        },

        /*
        * CSS Scrubbers
        */

        // Clean unused css styles
        uncss: {
          dist: {
            options: {
              csspath: '..',
              stylesheets: ['<%= config.tmp %>/styles/main.css']
                            //'<%= config.tmp %>/styles/vendor.css']
            },
            files: {
              '<%= config.tmp %>/styles/main.css' : ['<%= config.app %>/index.html']
              //'<%= config.tmp %>/styles/vendor.css' : ['<%= config.app %>/index.html']
            }
          }
        },

        // Add vendor prefixed styles
        autoprefixer: {
          options: {
            browsers: ['last 1 version']
          },
          dist: {
            files: [{
              expand: true,
              cwd: '<%= config.tmp %>/styles/',
              src: ['main.css', 'vendor.css'],
              dest: '<%= config.tmp %>/styles/'
            }]
          }
        },

        // Minify and optimize css styles
        cssnano: {
          options: {
              sourcemap: true
          },
          dist: {
              files: {
                  '<%= config.dist %>/styles/main.css': '<%= config.tmp %>/styles/main.css'
                  //'<%= config.dist %>/styles/vendor.css': '<%= config.tmp %>/styles/vendor.css'
              }
          }
        },

        /*
        * Image optimizers
        */

        imagemin: {
          dist: {
            files: [{
              expand: true,
              cwd: '<%= config.app %>/images',
              src: '{,*/}*.{png,jpg,jpeg,gif}',
              dest: '<%= config.dist %>/images'
            }]
          }
        },

        svgmin: {
          dist: {
            files: [{
              expand: true,
              cwd: '<%= config.app %>/images',
              src: '{,*/}*.svg',
              dest: '<%= config.dist %>/images'
            }]
          }
        },

        htmlmin: {
          dist: {
            options: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              collapseBooleanAttributes: true,
              removeCommentsFromCDATA: true,
              removeOptionalTags: true
            },
            files: [{
              expand: true,
              cwd: '<%= config.dist %>',
              src: ['*.html', 'partials/{,*/}*.html'],
              dest: '<%= config.dist %>'
            }]
          }
        },

        // Renames files for browser caching purposes
        filerev: {
          dist: {
            src: [
              '<%= config.dist %>/scripts/{,*/}*.js',
              '<%= config.dist %>/styles/{,*/}*.css',
              '<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
              '<%= config.dist %>/styles/fonts/*',
              '<%= config.dist %>/bower_components/**/*.{png,jpg,jpeg,gif,webp,svg,eot,ttf,woff}'
            ]
          }
        },

        // Replace Google CDN references
        cdnify: {
          dist: {
            html: ['<%= config.dist %>/*.html']
          }
        },

        // The actual grunt server settings
        connect: {
          options: {
            port: 9000,
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: 'localhost',
            livereload: 35729
          },
          livereload: {
            options: {
              open: true,
              middleware: function (connect) {
                return [
                  connect.static('<%= config.tmp %>'),
                  connect().use(
                    '/bower_components',
                    connect.static('./bower_components')
                  ),
                  connect.static(config.app)
                ];
              }
            }
          }
        }

    });


    grunt.registerTask('serve', 'Compile then start a connect web server, --allow-remote for remote access', function (target) {
      if (target === 'dist') {
        return grunt.task.run(['build', 'connect:dist:keepalive']);
      }

      grunt.task.run([
        'clean:server',
        'wiredep',
        'concurrent:server',
        'autoprefixer',
        'connect:livereload',
        'watch'
      ]);
    });

    grunt.registerTask('build', [
      'clean:dist',
      'wiredep',
      'useminPrepare',
      'concurrent:dist',
      'concat',
      'copy:dist',
      'cdnify',
      'uglify',
      'uncss',
      'autoprefixer',
      'cssnano',
      'filerev',
      'usemin',
      'htmlmin'
    ]);

    grunt.registerTask('default', [
      'newer:jshint',
      'build'
    ]);
};


