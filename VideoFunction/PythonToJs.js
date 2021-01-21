#!/usr/bin/env node 
//./PythonTest.js 로 실행가능하게 만듬 / 안쓰면 node PythonTest.js

// python -m pip install opencv-python (in vscode)
// python extension pack 다운로드 (in vscode)
// python -m pip install requests 안되면 
// git clone git://github.com/psf/requests.git -> cd requests -> python -m pip install .

const shell = require('shelljs')

function toFrame(){
    if (shell.exec('python ToFrame.py').code !== 0) {
        shell.echo('Error: python toFrame failed')
        shell.exit(1)
    }
}

function faceApi(){
    if (shell.exec('python FaceApi.py').code !== 0) {
        shell.echo('Error: python FaceApi failed')
        shell.exit(1)
    }
}

toFrame()
setTimeout(() => faceApi(), 10);
