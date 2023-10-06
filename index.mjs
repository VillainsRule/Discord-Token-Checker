import axios from 'axios';
import fs from 'fs';
import figlet from 'figlet';
import gradient from 'gradient-string';

console.clear();
console.log(gradient.fruit(
    figlet.textSync('T O K E N  C H E C K E R', {
        font: 'Stop',
        whitespaceBreak: true
    }) + '\n' + figlet.textSync('    built by @xthonk', {
        font: 'Small',
        whitespaceBreak: true
    }) + '\n\n'
));

let tokenFile = fs.readFileSync('./tokens.txt', { encoding: 'utf8' });

fs.rmSync('./output', { recursive: true, force: true });
fs.mkdirSync('./output', { recursive: true, force: true });

let read = 0;
let checked = 0;
let nitro = 0;
let working = 0;
let locked = 0;
let invalid = 0;

let headers = {
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
    'Referer': 'https://discord.com',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-GPC': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36'
};

const check_token = (token) => {
    axios.get(`https://discord.com/api/v9/users/@me/billing/subscriptions`, {
        headers: {
            Authorization: token,
            ...headers
        }
    }).then((res) => {
        if (res.status === 200 && res.data.length) {
            console.log(gradient(['#f06fe9', '#eb65e3'])(`Nitro Token: `) + gradient.instagram(token));
            nitro++;
            fs.appendFile('./output/nitro.txt', `${token}\n`, (err) => (err) ? console.log(tinycolor('magenta')(`Cannot save token to nitro file. ${err}`)) : false);
        } else if (res.status === 200) {
            console.log(gradient(['#0af030', '#0af030'])(`Working Token: `) + gradient.instagram(token));
            working++;
            fs.appendFile('./output/working.txt', `${token}\n`, (err) => (err) ? console.log(tinycolor('magenta')(`Cannot save token to working file. ${err}`)) : false);
        } else console.log(gradient(['magenta', 'magenta'])(`Unknown Error with code ${res.statusCode}. `) + gradient.instagram(token));

        checked++;
        if (checked === tokenFile.split('\n').length) console.log(`\n${gradient.instagram(`Checked ${checked} tokens! `)} ${gradient(['#f06fe9', '#eb65e3'])(`${nitro} (working) nitro,`)} ${gradient(['#0af030', '#0af030'])(`${working} working,`)} ${gradient(['#f0b30a', '#f0b30a'])(`${locked} locked,`)} ${gradient(['red', 'red'])(`& ${invalid} invalid.`)}`);
    }).catch((err) => {
        if (!err.response) {
            console.log(`\n${gradient.morning(`Unknown Error: `)}"${err}"${gradient.morning(`. Please report this in our Discord server. Quitting program...`)}\n`);
            return process.exit(0);
        };

        if (err.response.status === 401) {
            console.log(gradient(['red', 'red'])(`Token Invalid :|  > `) + gradient.instagram(token));
            fs.appendFile('./output/invalid.txt', `${token}\n`, (err) => (err) ? console.log(tinycolor('magenta')(`Cannot save token to invalid file. ${err}`)) : false);
            invalid++;
        } else if (err.response.status === 403) {
            console.log(gradient(['#f0b30a', '#f0b30a'])(`Token Locked :(   > `) + gradient.instagram(token));
            fs.appendFile('./output/locked.txt', `${token}\n`, (err) => (err) ? console.log(tinycolor('magenta')(`Cannot save token to locked file. ${err}`)) : false);
            locked++;
        } else console.log(gradient(['magenta', 'magenta'])(`Unknown Error with code ${err.response.status}. `) + gradient.instagram(token));

        checked++;
        if (checked === tokenFile.split('\n').length) console.log(`\n${gradient.instagram(`Checked ${checked} tokens! `)} ${gradient(['#f06fe9', '#eb65e3'])(`${nitro} (working) nitro,`)} ${gradient(['#0af030', '#0af030'])(`${working} working,`)} ${gradient(['#f0b30a', '#f0b30a'])(`${locked} locked,`)} ${gradient(['red', 'red'])(`& ${invalid} invalid.`)}`);
    });
};

tokenFile.split('\n').forEach(token => {
    read++;
    setTimeout(() => check_token(token), 1250 * read);
});
