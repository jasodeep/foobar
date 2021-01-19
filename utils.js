var fs = require('fs');
var libs = require('./libs.js');
var SSH = require('simple-ssh');

module.exports.configFilesExists = function () { 

    try {
        if (!fs.existsSync('./main.json')) {
            var err = new Error('main.json is missing')
            throw err
        }
        if (!fs.existsSync('./nodes.json')) {
            var err = new Error('nodes.json is missing')
            throw err
        }
    }
    catch (err) {
        console("**************");
        console.log('Required files are missing !!');
        console("**************");
        console.log(err);
    }
};

module.exports.executeMain = async function () { 
    let rawdata = fs.readFileSync('main.json');
    let main = JSON.parse(rawdata);
    for (let index = 0; index < main.length; index++) {
        console.log("Executing:"+main[index]['name']);
        for (let j = 0; j < main[index]['jobs'].length; j++) {
            let path = main[index]['jobs'][j]
            console.log("./jobs/"+main[index]['jobs']+"/main.json");
            if (fs.existsSync("./jobs/"+main[index]['jobs']+"/main.json")) {
                let rawdata = fs.readFileSync("./jobs/"+main[index]['jobs'][j]+"/main.json");
                let data = JSON.parse(rawdata);
                let nodes = getNodes(main[index]['nodes']);
                let jobs = data['jobs'];
                
                for (let i = 0; i < nodes.length; i++) {
                    for (let k = 0; k < jobs.length; k++) {
                        await executeJob(jobs[k], nodes[i], (err,msg)=> {
                            console.log(msg);
                        });
                    }
                }

            } else {
                console.log('FALSE');
            }
        }
        
    }
};


let executeJob = async function (job, node) {
    return new Promise((resolve, reject) => {
        if (job['module'] === 'install_package') {
            libs.installPackages(node, job['packages'], (err, msg) => {
                resolve(msg);
            });
        } else if (job['module'] === 'copy_file') {
            if (job['force_copy']?job['force_copy']:true) {
                libs.fileExists(node, job['destination'], (err, res) => {
                    if (!err && res === false) {
                        libs.copyFile(node, job['source'], job['destination'], job['permission'] ? job['permission'] : null, job['owner'] ? job['owner'] : null, (err, msg) => {
                            resolve(msg);
                        });
                    } else {
                        resolve('file already exists');
                    }
                });
            } else {
                libs.copyFile(node, job['source'], job['destination'], job['permission'] ? job['permission'] : null, job['owner'] ? job['owner'] : null, (err, msg) => {
                    resolve(msg);
                });
            }
        } else if (job['module'] === 'command') {
            libs.executeCommand(node, job['command'], (err, msg) => {
                resolve(msg);
            });
        } else {
            reject('Invalid Module');
        }
    });
}

let getNodes = function(jobNodes) {

    let selectedNodes = [];
    let nodes = JSON.parse(fs.readFileSync("./nodes.json"));

    for (let i = 0; i < jobNodes.length; i++) {
        for (let j = 0; j < nodes.length; j++) {
            if(jobNodes[i] === nodes[j]['name']) {
                selectedNodes = selectedNodes.concat(nodes[i]['nodes']);
            }
        }   
    }
    
    return selectedNodes;
}