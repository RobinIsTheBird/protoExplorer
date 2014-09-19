module.exports = function(grunt) {
    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                proto: true
            },
            all: ['Gruntfile.js', 'src/assets/javascript/unshared/*.js']
        }
    });
    // Load the jshint plugin.
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
