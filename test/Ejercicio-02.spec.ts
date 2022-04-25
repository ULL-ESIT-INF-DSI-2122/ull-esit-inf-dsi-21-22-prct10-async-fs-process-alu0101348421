import 'mocha';
import {expect} from 'chai';
import {searchPipe, searchSubprocess} from '../src/Ejercicio-02';


describe('Ejercicio 02', () => {
  describe('searchPipe', () => {
    let file: string;
    let word: string;

    beforeEach(() => {
      file = 'src/ficheroPrueba.txt';
      word = 'prueba';
    });

    it('should return the number of times the word appears in the file',
        () => {
          expect(searchPipe(file, word, (err, count) => {
            expect(err).to.be.null;
            expect(count).to.equal(3);
          }));
        });
  });
});