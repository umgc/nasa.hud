var fs = require('fs');

var yaml = require('js-yaml');

var procDir = './assets/procedures/';



// Function to return list of roles for a given procedure file

exports.get_roles = function(req, res) {

    var roles = [];

    try {

        const file = yaml.safeLoad(fs.readFileSync(procDir+req.params.filename, "utf8"));

        for(const role of file.columns){

          roles.push(role.key);

        }

        res.status(200).send(roles);

    } catch (e) {

        // Handle file not found exception

        if (e.code === 'ENOENT') {

            res.status(404).json({"error": "The selected file does not exist. Please try again."});

        }



    }

}
