var fs = require('fs');
var yaml = require('js-yaml');
var procDir = './procedures/';

// Function to return list of roles for a given procedure file
exports.get_roles = function(req, res) {
    var roles = [];
    const file = yaml.safeLoad(fs.readFileSync(procDir+req.params.filename, "utf8"));
    for(const role of file.columns){
        roles.push(role.display);
    }
    res.status(200).send(roles);
}