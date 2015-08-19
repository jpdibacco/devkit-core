var fs = require('graceful-fs');
var File = require('vinyl');
var path = require('path');
var readFile = Promise.promisify(fs.readFile);

function string(value) {
  return '\'' + value
      .replace(/\\/g, '\\\\')
      .replace(/\'/g, '\\\'')
    + '\'';
}

// Static resources.
function getLocalFilePath(filePath) {
  return path.join(__dirname, filePath);
}

exports.generate = function (config) {
  // build cache-worker
  return readFile(getLocalFilePath('../../clientapi/browser/cache-worker.js'), 'utf8')
    .then(function (js) {
      var keys = {
        'APP_ID': string(config.appID),
        'APP_VERSION': string(config.version),
        'ALLOW_MULTIPLE_APPS_PER_DOMAIN': true,
        'BASE_URLS': [
          string('index.html'),
          string(config.target + '.js')
        ]
      };

      Object.keys(keys).forEach(function (key) {
        var value = keys[key];
        js = js.replace(new RegExp('["\']INSERT:' + key + '["\']', 'g'), value);
      });

      return {
        name: 'cache-worker.js',
        contents: js
      };
    });
};

