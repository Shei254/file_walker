import fs from 'fs';
import { inspect } from 'util';
import { EventEmitter } from 'events'

const walk = function (dir, done, emitter) {
    const results = {};

    emitter = emitter || new EventEmitter();

    fs.readdir(dir, function (err, list) {
        if (err) {
            done(err, results);
        }


        let pending = list.length;
        if (!pending) {
            return done("no more files", results);
        }

        list.forEach(file => {
            var dFile = dir + "/" + file;
            fs.stat(dFile, function (err, stat) {
                if (stat.isDirectory()) {
                    emitter.emit("directory", dFile, stat);
                    return walk(dFile, function (err, res) {
                        results[file] = res;
                        !(--pending) && done(null, results);
                    }, emitter);
                }

                emitter.emit("file", file, stat);
                results[file] = stat;
                !(--pending) && done(null, results);

            });
        });
    });
    return emitter;
};

walk(".", function (err, res) {
   // if (err) {
    //    console.error(err);
     //   return;
   // }

//    console.log(inspect(res, { depth: null }));
}).on("directory", function (dFile, stat) {
    console.log(`Directory: ${dFile} - ${stat.size}`);
}).on("file", function (dFile, stat) {
    console.log(`File: ${dFile} - ${stat.size}`);
});