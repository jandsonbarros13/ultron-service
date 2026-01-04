import { exec } from 'child_process';

const action = process.argv[2];

if (action === 'shutdown') {
    exec('sudo shutdown -h now');
} else if (action === 'reboot') {
    exec('sudo reboot');
}
