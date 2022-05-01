import * as fs from 'fs';
import {Note} from './note';

/**
 * Dirección por defecto de la base de datos
 * @type {string}
 * @constant
 */
const DIR = './db';

/**
 * Clase que gestiona las notas
 * @class
 */
export class Management {
  readonly dir: string;

  /**
   * Constructor de la clase
   * @param dir Dirección de la base de datos
   */
  constructor(dir: string = DIR) {
    this.dir = dir;
  }

  /**
   * Función que comprueba si una nota existe
   * @param title Título de la nota
   * @param user Usuario de la nota
   * @returns {boolean}
   */
  public exists(title: string, user: string): boolean {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }
    if (!fs.existsSync(`${this.dir}/${user}`)) {
      return false;
    }
    const files = fs.readdirSync(`${this.dir}/${user}`,
        {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        if (file.name === title + '.json') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Función que añade una nota
   * @param note Nota a añadir
   * @param callback Función de callback con error
   */
  public addNote(note: Note, callback: (err: Error | null) => void): void {
    if (this.exists(note.title, note.user)) {
      callback(new Error('Note already exists'));
    } else {
      if (!fs.existsSync(`${this.dir}/${note.user}`)) {
        fs.mkdirSync(`${this.dir}/${note.user}`);
      }
      fs.writeFileSync(`${this.dir}/${note.user}/${note.title}.json`,
          JSON.stringify(note));
      callback(null);
    }
  }

  /**
   * Función que devuelve todas las notas de un usuario
   * @param user Usuario de las notas
   * @param callback Función de callback con error y notas
   */
  public getNotes(user: string | null, callback: (err: Error | null,
    notes: Note[]) => void): void {
    if (!fs.existsSync(`${this.dir}/${user}`)) {
      callback(new Error('User not found'), []);
    } else {
      const files = fs.readdirSync(`${this.dir}/${user}`,
          {withFileTypes: true});
      const notes: Note[] = [];
      for (const file of files) {
        if (file.isFile()) {
          const note = JSON.parse(fs.
              readFileSync(`${this.dir}/${user}/${file.name}`, 'utf8'));
          notes.push(note);
        }
      }
      callback(null, notes);
    }
  }

  /**
   * Función que devuelve una nota
   * @param user Usuario de la nota
   * @param title Título de la nota
   * @param callback Función de callback con error y nota
   */
  public getNote(user: string, title: string, callback:
      (err: Error | null, note: Note | null) => void): void {
    if (!this.exists(title, user)) {
      callback(new Error('Note not found'), null);
      return;
    }
    const note = JSON.parse(fs.
        readFileSync(`${this.dir}/${user}/${title}.json`, 'utf8'));
    callback(null, note);
  }

  /**
   * Función que elimina una nota
   * @param user Usuario de la nota
   * @param title Título de la nota
   * @param callback Función de callback con error
   */
  public removeNote(user: string, title: string,
      callback: (err: Error | null) => void): void {
    if (!this.exists(title, user)) {
      callback(new Error('Note not found'));
    } else {
      fs.unlinkSync(`${this.dir}/${user}/${title}.json`);
      callback(null);
    }
  }
}
