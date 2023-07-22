import chalk from 'chalk';
import axios from 'axios';
import fs from 'fs';
import figlet from 'figlet';

console.clear();
console.log(chalk.redBright(
    figlet.textSync('T O K E N  C H E C K E R', {
        font: 'Bloody',
        whitespaceBreak: true
    })
) + '\n\n');

let tokenFile = fs.readFileSync('./tokens.txt', { encoding: 'utf8' });

let read = 0;
let checked = 0;
let working = 0;
let locked = 0;
let invalid = 0;

const check_token = (token) => {
    axios.get(`https://discord.com/api/v9/users/@me/library`, {
        headers: {
            Authorization: token,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36'
        }
    }).then((res) => {
        switch(res.status) {
            case 200:
                console.log(chalk.greenBright(`Token Working!    > `) + chalk.white(token));
                working++;
                fs.appendFile('working.txt', `${token}\n`, (err) => (err) ? console.log(chalk.magenta(`Cannot save token to working file. ${err}`)) : false);
                break;
            default:
                console.log(chalk.magenta(`Unknown Error with code ${res.statusCode}. `) + chalk.white(token));
                break;
        };

        checked++;
        if (checked === tokenFile.split('\n').length) console.log(`\n${chalk.cyan(`Checked ${checked} tokens! `)} ${chalk.green(`${working} working,`)} ${chalk.yellow(`${locked} locked,`)} ${chalk.red(`& ${invalid} invalid.`)}`);
    }).catch((err) => {
        switch(err.response.status) {
            case 401:
                console.log(chalk.redBright(`Token Invalid :|  > `) + chalk.white(token));
                invalid++;
                break;
            case 403:
                console.log(chalk.yellowBright(`Token Locked :(   > `) + chalk.white(token));
                locked++;
                break;
            default:
                console.log(chalk.magenta(`Unknown Error with code ${err.response.status}. `) + chalk.white(token));
                break;
        };

        checked++;
        if (checked === tokenFile.split('\n').length) console.log(`\n${chalk.cyan(`Checked ${checked} tokens! `)} ${chalk.greenBright(`${working} working,`)} ${chalk.yellowBright(`${locked} locked,`)} ${chalk.redBright(`& ${invalid} invalid.`)}\n`);
    });
};

tokenFile.split('\n').forEach(token => {
    read++;
    setTimeout(() => check_token(token), 1250 * read);
});
