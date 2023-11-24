import axios from 'axios';
import fs from 'fs';
import figlet from 'figlet';
import gradient from 'gradient-string';
import YAML from 'yaml';

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
let nitro = [];
let working = [];
let locked = [];
let invalid = [];

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

const end = () => {
    console.log(`\n${gradient.instagram(`Checked ${checked} tokens! `)} ${gradient(['#f06fe9', '#eb65e3'])(`${nitro.length} (working) nitro,`)} ${gradient(['#0af030', '#0af030'])(`${working.length} working,`)} ${gradient(['#f0b30a', '#f0b30a'])(`${locked.length} locked,`)} ${gradient(['red', 'red'])(`& ${invalid.length} invalid.`)}`);
    fs.writeFileSync('./output/final.yaml', YAML.stringify({ accounts: { nitro, working, locked, invalid } }));
    process.exit(0);
};

const check_token = async (token) => {
    try {
        let res = await axios.get(`https://discord.com/api/v9/users/@me`, {
            headers: {
                Authorization: token,
                ...headers
            }
        });

        if (res.status === 200 && res.data.premium_type !== 0) {
            console.log(`${gradient(['#f06fe9', '#eb65e3'])(`[ Nitro ] `)}\n     ${(res.data.discriminator !== '0' ? gradient.vice(res.data.username + '#' + res.data.discriminator) : gradient.vice('@' + res.data.username))}\n     ${gradient.vice(token)}`);
            nitro.push({ name: res.data.username + '#' + res.data.discriminator, token });
            fs.appendFile('./output/nitro.txt', `${token}\n`, (err) => (err) ? console.log(tinycolor('magenta')(`Cannot save token to nitro file. ${err}`)) : false);
        } else if (res.status === 200) {
            console.log(`${gradient(['#0af030', '#0af030'])(`[ Working ] `)}\n     ${(res.data.discriminator !== '0' ? gradient.vice(res.data.username + '#' + res.data.discriminator) : gradient.vice('@' + res.data.username))}\n     ${gradient.vice(token)}`);
            working.push({ name: res.data.username + '#' + res.data.discriminator, token });
            fs.appendFile('./output/working.txt', `${token}\n`, (err) => (err) ? console.log(tinycolor('magenta')(`Cannot save token to working file. ${err}`)) : false);
        } else console.log(gradient(['magenta', 'magenta'])(`Unknown Error with code ${res.statusCode}. `) + gradient.instagram(token));

        checked++;
        if (checked === tokenFile.split('\n').length) end();
    } catch (err) {
        if (!err.response) {
            console.log(`\n${gradient.morning(`Unknown Error: `)}"${err}"${gradient.morning(`. Please open an issue & report this error on Github. Quitting program...`)}\n`);
            return process.exit(0);
        };

        if (err.response.status === 401) {
            console.log(`${gradient(['red', 'red'])(`[ Invalid ] `)}\n     ${gradient.vice(token)}`);
            fs.appendFile('./output/invalid.txt', `${token}\n`, (err) => (err) ? console.log(tinycolor('magenta')(`Cannot save token to invalid file. ${err}`)) : false);
            invalid.push({ token });
        } else if (err.response.status === 403) {
            console.log(`${gradient(['#f0b30a', '#f0b30a'])(`[ Locked ] `)}\n     ${gradient.vice(token)}`);
            fs.appendFile('./output/locked.txt', `${token}\n`, (err) => (err) ? console.log(tinycolor('magenta')(`Cannot save token to locked file. ${err}`)) : false);
            locked.push({ token });
        } else console.log(gradient(['magenta', 'magenta'])(`Unknown Error with code ${err.response.status}. `) + gradient.instagram(token));

        checked++;
        if (checked === tokenFile.split('\n').length) end();
    };
};

tokenFile.split('\n').forEach(token => {
    read++;
    setTimeout(() => check_token(token), 1250 * read);
});