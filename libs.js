var utils = require('./utils.js');
const SSH = require('simple-ssh');
const scp = require('node-scp')

let installPackageOverSSH = (node, packageNames, callback) => {
    console.log("\n\n*****************");
    console.log('NODE: '+node.host);
    console.log('ACTION: Install packages - '+packageNames);
    console.log("*****************");
	var ssh = new SSH({
	    host: node.host,
	    user: node.user,
	    pass: node.password
    });

	ssh.exec('sudo dpkg -S '+packageNames+' || sudo apt-get update -y && sudo apt-get install '+packageNames+' -y', {
	    out: function(stdout) {
            console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr);
            callback(true, stderr);
        }
    }).start();

    ssh.on('end', function(err) {
        callback(true, 'done');
    });
};

let executeCommandOverSSH = (node, command, callback) => {
    console.log("\n\n*****************");
    console.log('NODE: '+node.ip);
    console.log('ACTION: Execute Command - '+command);
    console.log("*****************");
	var ssh = new SSH({
	    host: node.ip,
	    user: node.username,
	    pass: node.password
	});
	ssh.exec(command, {
	    out: function(stdout) {
            // console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr);
            callback(true, stderr);
        }
    }).start();

    ssh.on('error', function(error) {
        callback(true, error);
    });

    ssh.on('end', function(response) {
        callback(false, response);
    });
};


module.exports.installPackages = (node, packageNames, callback) => { 
    
    installPackageOverSSH({
        host: node.ip,
        user: node.username,
        password: node.password
    }, packageNames.join(" "), (err, msg)=>{
        callback(err, msg);
    });
};

module.exports.copyFile = (node, src, dest, perm, own, callback) => { 
        scp({
            host: node.ip,
            port: 22,
            username: node.username,
            password: node.password,
          }).then(client => {
            client.uploadFile(src, dest)
                  .then(response => {
                    client.close()
                    let command=null;
                    perm?(command='chmod '+perm+' '+dest):(command=null);
                    own?(perm?(command=command+' ; chown '+own+' '+dest):chown+' '+own+' '+dest):(command=null)
                    if(command) {
                        executeCommandOverSSH(node, command, (err, msg)=>{
                            callback(err, msg);
                        })
                    }
                  })
                  .catch(error => {
                      console.log(error);
                    callback(true, error);
                  })
          }).catch(e => console.log(e))
};

module.exports.fileExists = (node, path, callback) => {
    scp({
        host: node.ip,
        port: 22,
        username: node.username,
        password: node.password,
      }).then(client => {
        client.exists(path)
              .then(response => {
                  client.close()
                  callback(false, response);
              })
              .catch(error => {
                console.log(error);
                callback(true, error);
              })
      }).catch(e => console.log(e))
};

module.exports.executeCommand = (node, command, callback) => {
    console.log("\n\n*****************");
    console.log('NODE: '+node.ip);
    console.log('ACTION: Execute Command - '+command);
    console.log("*****************");
	var ssh = new SSH({
	    host: node.ip,
	    user: node.username,
	    pass: node.password
	});
	ssh.exec(command, {
	    out: function(stdout) {
            // console.log(stdout);
        },
        err: function(stderr) {
            console.log(stderr);
            callback(true, stderr);
        }
    }).start();

    ssh.on('error', function(error) {
        callback(true, error);
    });

    ssh.on('end', function(response) {
        callback(false, response);
    });
};