var fs = require('fs');
var yaml = require('js-yaml');
var procDir = './assets/procedures/';

// Function to return list of all procedure files from the filesystem
exports.get_files = function (req, res) {
    var response = [];
    fs.readdirSync(procDir).forEach(file => {
        response.push(file);
    })
    res.status(200).send(response);
}

// Function to validate the format of the provided procedure file
exports.lint_file = function (req, res) {
    var response;
    try {
        response = yaml.safeLoad(fs.readFileSync(procDir + req.params.filename, "utf8"));
    } catch (e) {
        // Handle file not found exception
        if (e.code === 'ENOENT') {
            res.status(404).send({"error": "The selected file does not exist. Please try again."});
        }
        // Handle invalid yaml files
        else {
            res.status(422).send({"error": "The selected procedure file is unreadable. Please ensure the format and file type (.yml) are correct."});
        }
    }
    res.status(200).send(response);
}