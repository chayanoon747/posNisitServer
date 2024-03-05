const fs = require('fs');
const ftpClient = require('ftp');

const config = require('./config.json');

const ftp = new ftpClient();

ftp.connect({
    host: config.FTP.host,
    user: config.FTP.username,
    password: config.FTP.password
});

ftp.on('ready', () => {
    function downloadFile(filename) {
        ftp.get(filename, (err, stream) => {
            if (err) {
                console.error("Error occurred:", err);
            } else {
                stream.once('close', () => ftp.end());
                stream.pipe(fs.createWriteStream(filename));
                console.log("Download successful.");
            }
        });
    }

    ftp.list((err, list) => {
        if (err) {
            console.error("Error:", err);
        } else {
            console.log("List of files:");
            list.forEach(item => console.log(item.name));
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('Filename: ', (filename) => {
                downloadFile(filename);
                readline.close();
            });
        }
    });
});

ftp.on('error', (err) => {
    console.error("FTP connection error:", err);
});
