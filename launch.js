const path = require('path');
const { spawn } = require('child_process');
const cwd = path.resolve(__dirname, './');
const isWin = process.platform === 'win32';
const command = isWin ? 'npm.cmd' : 'npm';
const baseArgs = ['run'];
const argv = process.argv;
const suffix = isWin ? 'win' : 'mac';
const param = argv[2] ? `${suffix}_dev` : suffix;

const run = (args, stdout, stderr, close, error) => {
    let process = spawn(command, args, {
        cwd: cwd,
    });

    process.stdout.on('data', data => {
        if(stdout) {
            stdout(data.toString('utf-8'));
        }
    });

    process.stderr.on('data', data => {
        if(stderr) {
            stderr(data.toString('utf-8'));
        }
    });

    process.on('close', () => {
        if(close) {
            close();
        }
    });
    
    process.on('error', err => {
        if(error) {
            error(err.toString('utf-8'));
        }
    });

    return process;
};

const serve = callback => {
    const args = baseArgs.concat(['serve']);
    const stdoutStr = 'To create a production build, run npm run build.';
    const stderrStr = '<s> [webpack.Progress] ';
    return run(args, stdout => {
        if(stdout.toString('utf-8').indexOf(stdoutStr) > -1) {
            console.info('Serve done!');
            if(callback) {
                callback();
            }
        }
    }, stderr => {
        (function(text) {
            let t = text.split(stderrStr);
            console.info(t.join(''));
        })(stderr);
    }, close => {
        console.info('Serve closed!');
    }, error => {
        console.error(error);
        process.exit(0);
    });
}

const app = () => {
    const args = baseArgs.concat([param]);
    return run(args, stdout => {
        console.info(stdout);
    }, stderr => {
        console.info(stderr);
    }, close => {
        console.info('App closed!');
        launch.kill();
        process.exit(0);
    }, error => {
        console.error(error);
        process.exit(0);
    });
} 

let launch = serve(app);