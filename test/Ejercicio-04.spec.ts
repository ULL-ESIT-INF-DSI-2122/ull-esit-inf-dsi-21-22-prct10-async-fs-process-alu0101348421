import 'mocha';
import {expect} from 'chai';
import {spawn} from 'child_process';
import {Wrapper} from '../src/Ejercicio-04';

describe('Ejercicio 04', () => {
  let wrapper: Wrapper;
  let testDir: string;
  let errTestDir: string;
  let testFile: string;
  let errTestFile: string;

  beforeEach(() => {
    testDir = 'test/testDir';
    errTestDir = 'test/testDirNoExiste';
    testFile = 'test/testDir/ficheroPrueba.txt';
    errTestFile = 'test/testDir/ficheroPruebaNoExiste.txt';
    wrapper = Wrapper.getInstance();
  });

  describe('isFile', () => {
    it('should return true if the path is a file', (done) => {
      wrapper.isFile(testFile, (err, isFile) => {
        expect(err).to.be.null;
        expect(isFile).to.be.true;
        done();
      });
    });
    it('should return false if the path is not a file', (done) => {
      wrapper.isFile(testDir, (err, isFile) => {
        expect(err).to.be.null;
        expect(isFile).to.be.false;
        done();
      });
    });
    it('should return false if the path does not exist', (done) => {
      wrapper.isFile(errTestFile, (err, isFile) => {
        expect(err).to.be.null;
        expect(isFile).to.be.false;
        done();
      });
    });
  });
  describe('isDir', () => {
    it('should return true if the path is a directory', (done) => {
      wrapper.isDir(testDir, (err, isDir) => {
        expect(err).to.be.null;
        expect(isDir).to.be.true;
        done();
      });
    });
    it('should return false if the path is not a directory', (done) => {
      wrapper.isDir(testFile, (err, isDir) => {
        expect(err).to.be.null;
        expect(isDir).to.be.false;
        done();
      });
    });
    it('should return false if the path does not exist', (done) => {
      wrapper.isDir(errTestDir, (err, isDir) => {
        expect(err).to.be.null;
        expect(isDir).to.be.false;
        done();
      });
    });
  });
  describe('mkdir', () => {
    it('should create a directory', (done) => {
      wrapper.mkdir(`${testDir}/testDir2`, (err) => {
        expect(err).to.be.null;
        done();
      });
    });
    it('should not create a directory if it already exists', (done) => {
      wrapper.mkdir(testDir, (err) => {
        expect(err).to.be.null;
        done();
      });
    });

    after(() => {
      wrapper.rm(`${testDir}/testDir2`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  });
  describe('rm', () => {
    before(() => {
      spawn('touch', [`${testDir}/testFile.txt`]);
      spawn('mkdir', [`${testDir}/testDir2`]);
    });
    it('should remove a file', (done) => {
      wrapper.rm(`${testDir}/testFile.txt`, (err) => {
        expect(err).to.be.null;
        done();
      });
    });
    it('should not remove a file if it does not exist', (done) => {
      wrapper.rm(`${testDir}/testFileNoExiste.txt`, (err) => {
        expect(err).to.be.not.null;
        done();
      });
    });
    it('should remove a directory', (done) => {
      wrapper.rm(`${testDir}/testDir2`, (err) => {
        expect(err).to.be.null;
        done();
      });
    });
    it('should not remove a directory if it does not exist', (done) => {
      wrapper.rm(`${testDir}/testDir2NoExiste`, (err) => {
        expect(err).to.be.not.null;
        done();
      });
    });
  });
  describe('ls', () => {
    it('should return a list of files', (done) => {
      wrapper.ls(testDir, (err, files) => {
        expect(err).to.be.null;
        expect(files).to.be.an('array');
        expect(files.length).to.be.eql(1);
        done();
      });
    });
    it('should return error if the directory does not exist', (done) => {
      wrapper.ls(errTestDir, (err, files) => {
        expect(err).to.be.not.null;
        expect(files).to.be.an('array');
        expect(files.length).to.be.eql(0);
        done();
      });
    });
  });
  describe('readFile', () => {
    it('should return the content of a file', (done) => {
      wrapper.readFile(testFile, (err, content) => {
        expect(err).to.be.null;
        expect(content).to.include('prueba');
        done();
      });
    });
    it('should return error if the file does not exist', (done) => {
      wrapper.readFile(errTestFile, (err, content) => {
        expect(err).to.be.not.null;
        expect(content).to.be.eql('');
        done();
      });
    });
  });
  describe('move', () => {
    before(() => {
      spawn('mkdir', [`${testDir}/testDir2`]);
      spawn('touch', [`${testDir}/testFile.txt`]);
    });
    it('should move a file', (done) => {
      wrapper.move(`${testDir}/testFile.txt`,
          `${testDir}/testDir2/testFile.txt`, (err) => {
            expect(err).to.be.null;
            done();
          });
    });
    it('should not move a file if it does not exist', (done) => {
      wrapper.move(`${testDir}/testFileNoExiste.txt`,
          `${testDir}/testDir2/test.txt`, (err) => {
            expect(err).to.be.not.null;
            done();
          });
    });
    after((done) => {
      spawn('rm', [`${testDir}/testDir2`, '-rf']);
      done();
    });
  });
});