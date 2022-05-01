import 'mocha';
import {expect} from 'chai';
import {searchPipe, searchSubprocess} from '../src/Ejercicio-02';


describe('Ejercicio 02', () => {
  let file: string;
  let errFile: string;
  let word: string;

  beforeEach(() => {
    file = 'test/testDir/ficheroPrueba.txt';
    errFile = 'test/testDir/ficheroPruebaNoExiste.txt';
    word = 'prueba';
  });

  describe('searchPipe', () => {
    it('should return the number of times the word appears in the file',
        (done) => {
          searchPipe(file, word, (err, count) => {
            expect(err).to.be.null;
            expect(count).to.equal(3);
            done();
          });
        });
    it('should return an error if the file does not exist',
        (done) => {
          searchPipe(errFile, word, (err, count) => {
            expect(err).to.be.an.instanceof(Error);
            expect(count).to.equal(0);
            done();
          });
        });
  });
  describe('searchSubprocess', () => {
    it('should return the number of times the word appears in the file',
        (done) => {
          searchSubprocess(file, word, (err, count) => {
            expect(err).to.be.null;
            expect(count).to.equal(3);
            done();
          });
        });
    it('should return an error if the file does not exist',
        (done) => {
          searchSubprocess(errFile, word, (err, count) => {
            expect(err).to.be.an.instanceof(Error);
            expect(count).to.equal(0);
            done();
          });
        });
  });
});