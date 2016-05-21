var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');

gulp.task('jade', function() {
	return gulp.src('./app/jade/*.jade')
		.pipe(jade({pretty: true}))
		.pipe(gulp.dest('./app'));
});

gulp.task('sass', function() {
	return gulp.src('./app/sass/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('./app/css'));
});

gulp.task('watch', function() {
	gulp.watch('./app/jade/*.jade', ['jade']);
	gulp.watch('./app/sass/*.sass', ['sass']);
});

gulp.task('default', ['jade', 'sass']);