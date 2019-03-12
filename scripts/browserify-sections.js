const fs = require("fs");
const path = require("path");
const browserify = require("browserify");
const babelify = require("babelify");

const VIEW_DIR = path.resolve(process.cwd(), "views/");

console.log(`VIEW_DIR: '${VIEW_DIR}'`);

if (!fs.existsSync(VIEW_DIR)) {
    throw Error(`'${VIEW_DIR}' doesn't exist. Please write 'create-section' command before using this one.`);
}

function buildSection(filePath) {
    const bundlePath = path.resolve(path.dirname(filePath), "out", "bundle.js");
    console.log(`bundlePath: ${bundlePath}`);
    browserify({ debug: true })
        .transform(babelify, {presets: ["@babel/preset-env", "@babel/preset-react"]})
        .require(path.resolve(filePath), { entry: true })
        .bundle()
        .on("error", (err) => {
            throw Error(`Something went wrong: ${err}`);
        })
        .pipe(fs
            .createWriteStream(
                path.resolve(bundlePath)
            )
        );
}

fs.readdir(VIEW_DIR, (err, files) => {
    if (err) {
        throw err;
    }

    if (files.length === 0) {
        throw Error(`'${VIEW_DIR}' is empty.`);
    }

    files.forEach((file) => {
        console.log(`file path: '${path.resolve(VIEW_DIR, file, "entry.js")}'`);
        buildSection(path.resolve(VIEW_DIR, file, "entry.js"));
    });
});
