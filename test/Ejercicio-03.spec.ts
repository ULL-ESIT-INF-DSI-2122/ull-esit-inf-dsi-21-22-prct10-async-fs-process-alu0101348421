import 'mocha';
import {expect} from 'chai';
import {getUser} from '../src/Ejercicio-03';

describe('Ejercicio 03', () => {
  let dir: string;
  let user: string;
  before(() => {
    dir = 'src/P9/db/user1';
    user = 'user1';
  });
  describe('getUser', () => {
    it('should return the user of the file', (done) => {
      getUser(`${dir}/nota1.json`, (err, noteUser) => {
        expect(err).to.be.null;
        expect(noteUser).to.equal(user);
        done();
      });
    });
  });
});