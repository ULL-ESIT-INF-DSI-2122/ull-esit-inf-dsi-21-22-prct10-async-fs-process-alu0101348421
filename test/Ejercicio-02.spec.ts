import 'mocha';
import {expect} from 'chai';
import {searchPipe, searchSubprocess} from '../src/Ejercicio-02';


describe('Ejercicio 02', () => {
  describe('searchPipe', () => {
    let file: string;
    let errFile: string;
    let word: string;

    beforeEach(() => {
      file = 'test/testDir/ficheroPrueba.txt';
      errFile = 'test/testDir/ficheroPruebaNoExiste.txt';
      word = 'prueba';
    });

    it('should return the number of times the word appears in the file',
        () => {
          searchPipe(file, word, (err, count) => {
            expect(err).to.be.null;
            expect(count).to.equal(3);
          });
          searchPipe(file, 'prueba2', (err, count) => {
            expect(err).to.be.null;
            expect(count).to.equal(0);
          });
          searchPipe(errFile, word, (err, count) => {
            expect(err).to.be.not.null;
            expect(count).to.equal(0);
          });
        });
  });

  // describe('searchSubprocess', () => {
  //   let file: string;
  //   let errFile: string;
  //   let word: string;

  //   beforeEach(() => {
  //     file = 'test/testDir/ficheroPrueba.txt';
  //     errFile = 'test/testDir/ficheroPruebaNoExiste.txt';
  //     word = 'prueba';
  //   });

  //   it('should return the number of times the word appears in the file',
  //       function(done) {
  //       });
  // });
});