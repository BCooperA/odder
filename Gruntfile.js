module.exports = function(grunt) {

    grunt.initConfig({

        // JavaScript TASKS ================================================================
        uglify: {
            dist: { // minifies all the javascript files from the "backend" folder
                files: [{
                    expand: true, // expand the folder structure
                    src: '**/*.js', // all files inside the "cwd"
                    dest: 'backend/src', // folder for minified JS files
                    cwd: 'backend/dist/', // folder for the original JS files
                    rename: function(dest, src) { return dest + '/' + src; }
                }]
            }
        },

        less: {
          dev: {
              options: {
                  paths: ["frontend/less"],
                  compress: true
              },
              files: {
                  'public/css/app.min.css' : 'public/less/app.less'
              }
          }
        },

        // COOL TASKS ==============================================================
        // watch css and js files and process the above tasks
        watch: {
            js: {
                files: ['backend/dist/**/*.js'],
                tasks: ['uglify']
            },
            less: {
                files: ['public/less/*.less'],
                tasks: ['less:dev']
            }
        },

        nodemon: { // watch our node server for changes
            dev: {
                script: 'server.js'
            }
        },

        concurrent: { // run watch and nodemon at the same time
            options: {
                logConcurrentOutput: true
            },
            tasks: ['watch', 'nodemon']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    //grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('default', ['concurrent']);

};