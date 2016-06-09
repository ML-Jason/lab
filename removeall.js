var exec = require('child_process').exec;
var package = require('./package.json');

//console.log(package.dependencies);
console.log('Uninstall dependencies');
for (var itm in package.dependencies) {
	console.log(itm);
	var child = exec('npm uninstall '+itm, function(err, stdout, stderr) {
		if (err)
			console.log('err', err);
		if (stdout)
			console.log('stdout', stdout);
		if (stderr)
			console.log('stderr', stderr);
	})
}
console.log('Uninstall devDependencies');
for (var itm in package.devDependencies) {
	console.log(itm);
	var child = exec('npm uninstall '+itm, function(err, stdout, stderr) {
		if (err)
			console.log('err', err);
		if (stdout)
			console.log('stdout', stdout);
		if (stderr)
			console.log('stderr', stderr);
	})
}