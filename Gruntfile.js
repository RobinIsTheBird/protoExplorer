module.exports = function(grunt) {
    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['src/assets/javascript/unshared/*.js']
        }
    });
    // Load the jshint plugin.
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
