/**
 * Tipo de color que puede tener una nota
 */
type Color = 'red' | 'green' | 'blue' | 'yellow';

/**
 * Clase que representa una nota
 * @class
 */
export class Note {
  public user: string;
  public title: string;
  public body: string;
  public color: Color;

  /**
   * Constructor de la clase
   * @param user Usuario de la nota
   * @param title Título de la nota
   * @param body Contenido de la nota
   * @param color Color de la nota
   */
  constructor(user: string, title: string, body: string, color: Color) {
    this.user = user;
    this.title = title;
    this.body = body;
    this.color = color;
  }
}

