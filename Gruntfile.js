'use strict';

module.exports = function(grunt) {

    // Load Grunt tasks declared in the package.json file
    // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

     // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var config = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };


    // Project configuration.
    grunt.initConfig({

        config: config,

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
                  connect.static('.tmp'),
                  connect().use(
                    '/bower_components',
                    connect.static('./bower_components')
                  ),
                  connect.static(appConfig.app)
                ];
              }
            }
          }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
          bower: {
              files: ['bower.json'],
              tasks: ['wiredep']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['newer:jshint:all']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'cssnano']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        dist: {
          options: {
            open: true,
            base: '<%= config.dist %>'
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
          },

        // Empties folders to start fresh
        clean: {
          dist: {
            files: [{
              dot: true,
              src: [
                '.tmp',
                '<%= config.dist %>/{,*/}*',
                '!<%= config.dist %>/.git*'
              ]
            }]
          },
          server: '.tmp'
        },

        // Automatically inject Bower components into the app
        wiredep: {
          app: {
            src: ['<%= config.app %>/index.html'],
            ignorePath:  /\.\.\//
          }
        },

        // Renames files for browser caching purposes
        filerev: {
          dist: {
            src: [
              '<%= config.dist %>/scripts/{,*/}*.js',
              '<%= config.dist %>/styles/{,*/}*.css',
              '<%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
              '<%= config.dist %>/styles/fonts/*'
            ]
          }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
          html: '<%= config.app %>/index.html',
          options: {
            dest: '<%= config.dist %>',
            flow: {
              html: {
                steps: {
                  js: ['concat', 'uglifyjs'],
                  css: ['cssnano']
                },
                post: {}
              }
            }
          }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
          html: ['<%= config.dist %>/{,*/}*.html', '<%= config.dist %>/**/*.html', '<%= config.dist %>/**/*.html'],
          css: ['<%= config.dist %>/styles/{,*/}*.css'],
          js: ['<%= config.dist %>/scripts/{,*/}*.js','<%= config.dist %>/scripts/**/**.js' ],
          options: {
            assetsDirs: ['<%= config.dist %>','<%= config.dist %>/images'],
            patterns: {
              js: [
                  [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
              ] 
            }
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

        // Replace Google CDN references
        cdnify: {
          dist: {
            html: ['<%= config.dist %>/*.html']
          }
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
                '*.{ico,png,txt}',
                '.htaccess',
                '*.html',
                'partials/{,*/}*.html',
                'images/{,*/}*.{webp}',
                'fonts/*'
              ]
            }, {
              expand: true,
              cwd: '.tmp/images',
              dest: '<%= config.dist %>/images',
              src: ['generated/*']
            }]
          },
          styles: {
            expand: true,
            cwd: '<%= config.app %>/styles',
            dest: '.tmp/styles/',
            src: '{,*/}*.css'
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
      'autoprefixer',
      'concat',
      'ngAnnotate',
      'copy:dist',
      'cdnify',
      'cssnano',
      'uglify',
      'filerev',
      'usemin',
      'htmlmin'
    ]);

    grunt.registerTask('default', [
      'newer:jshint',
      'test',
      'build'
    ]);
};


