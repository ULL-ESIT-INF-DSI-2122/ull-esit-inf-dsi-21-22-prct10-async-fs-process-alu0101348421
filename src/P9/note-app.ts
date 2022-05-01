import chalk from 'chalk';
import * as yargs from 'yargs';
import {Note} from './note';
import {Management} from './management';

/**
 * Objeto de manejo de notas
 * @type {management}
 */
const gestor = new Management();

/**
 * Yargs para la línea de comandos
 * @type {yargs}
 */
yargs
    .command({
      /**
       * Comando para añadir una nota
       * @param user Usuario de la nota
       * @param title Título de la nota
       * @param body Contenido de la nota
       * @param color Color de la nota
       */
      command: 'add',
      describe: 'Add a new note',
      builder: {
        user: {
          describe: 'User of the note',
          demandOption: true,
          type: 'string',
        },
        title: {
          describe: 'Note title',
          demandOption: true,
          type: 'string',
        },
        body: {
          describe: 'Note body',
          demandOption: true,
          type: 'string',
        },
        color: {
          describe: 'Note color',
          demandOption: true,
          type: 'string',
          choices: ['red', 'green', 'blue', 'yellow'],
        },
      },
      handler: (argv) => {
        const tmp = new Note(argv.user as string,
            argv.title as string, argv.body as string,
            argv.color as 'red' | 'green' | 'blue' | 'yellow');
        gestor.addNote(tmp, (err) => {
          if (err == null) {
            console.log(chalk.green('Note added'));
          } else if (err.message === 'Note already exists') {
            console.log(chalk.red('Note title taken'));
          } else {
            console.log(chalk.red('Error: ' + err.message));
          }
        });
      },
    })
    .command({
      /**
       * Comando para obtener todas las notas de un usuario
       * @param user Usuario de las notas
       */
      command: 'list',
      describe: 'List all notes',
      builder: {
        user: {
          describe: 'User of the notes',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        console.log(chalk.gray('Your notes:'));
        gestor.getNotes(argv.user as string, (err, notes) => {
          if (err) {
            console.log(chalk.red('Error: ' + err.message));
          } else {
            notes.forEach((note) => {
              const color = note.color === 'red' ? chalk.red :
              note.color === 'green' ? chalk.green :
              note.color === 'blue' ? chalk.blue : chalk.yellow;
              console.log(color.inverse(note.title));
            });
          }
        });
      },
    })
    .command({
      /**
       * Comando para obtener una nota
       * @param user Usuario de la nota
       * @param title Título de la nota
       */
      command: 'read',
      describe: 'Read a note',
      builder: {
        user: {
          describe: 'User of the note',
          demandOption: true,
          type: 'string',
        },
        title: {
          describe: 'Note title',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        gestor.getNote(argv.user as string, argv.title as string,
            (err, note) => {
              if (err) {
                console.log(chalk.red('Error: ' + err.message));
              } else {
                const tmp = note as Note;
                const color = tmp.color === 'red' ? chalk.red :
                tmp.color === 'green' ? chalk.green :
                tmp.color === 'blue' ? chalk.blue : chalk.yellow;
                console.log(color.inverse(tmp.title));
                console.log(tmp.body);
              }
            });
      },
    })
    .command({
      /**
       * Comando para borrar una nota
       * @param user Usuario de la nota
       * @param title Título de la nota
       */
      command: 'remove',
      describe: 'Remove a note',
      builder: {
        user: {
          describe: 'User of the note',
          demandOption: true,
          type: 'string',
        },
        title: {
          describe: 'Note title',
          demandOption: true,
          type: 'string',
        },
      },
      handler: (argv) => {
        gestor.removeNote(argv.user as string, argv.title as string, (err) => {
          if (err == null) {
            console.log(chalk.green('Note removed'));
          } else if (err.message === 'Note not found' ||
              err.message === 'You are not the owner of this note') {
            console.log(chalk.red(err.message));
          } else {
            console.log(chalk.red('Error: ' + err.message));
          }
        });
      },
    })
    .help();

yargs.parse();