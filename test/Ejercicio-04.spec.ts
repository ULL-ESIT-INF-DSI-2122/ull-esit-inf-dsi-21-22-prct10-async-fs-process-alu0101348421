import 'mocha';
import {expect} from 'chai';
import {Wrapper} from '../src/Ejercicio-04';

describe('Ejercicio 04', () => {
  let wrapper: Wrapper;
  let testDir: string;
  let testFile: string;

  beforeEach(() => {
    testDir = 'test/testDir';
    testFile = 'test/testDir/ficheroPrueba.txt';
    wrapper = Wrapper.getInstance();
  });

  it('should be able to return if a path is a file', function(done) {
    wrapper.isFile(testFile, (err, isFile) => {
      expect(err).to.be.null;
      expect(isFile).to.be.true;
      done();
    });
  });
});