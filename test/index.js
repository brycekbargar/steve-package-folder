'use strict';

const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
require('sinon-as-promised')(require('bluebird'));
const stub = sinon.stub;
const expect = require('chai')
  .use(require('sinon-chai'))
  .use(require('chai-as-promised'))
  .expect;

const proxyquireStubs = { fs: { stat: 'stat' } };

const _ = 'A SUPER COOL FOLDER';

describe('For the Steve Package Folder', () => {
  beforeEach('Setup Spies', () => {
    this.promisifyStub = stub();
    proxyquireStubs['bluebird'] = { promisify: this.promisifyStub };
  });
  beforeEach('Setup Package Folder', () => {
    let PackageFolder = proxyquire('./../index.js', proxyquireStubs);
    this.packageFolder = new PackageFolder(_);
  });
  describe('when #isValid() is called', () => {
    beforeEach('Setup Spies', () => {
      this.statStub = stub();
      this.statStub.resolves();
      this.promisifyStub.withArgs('stat').returns(this.statStub);
    });
    it('expect the constructor folder to be passed', () => {
      this.packageFolder.isValid();
      expect(this.statStub).to.have.been.calledOnce;
      expect(this.statStub).to.have.been.calledWith(_);
    });
    it('and the folder is missing expect it to be ok', () => {
      this.statStub.rejects({ code: 'EEXIST' });
      let isValid = this.packageFolder.isValid();
      expect(isValid).to.eventually.be.ok;
    });
    it('and it fails for any other reason expect it to not be ok', () => {
      this.statStub.rejects(new Error());
      let isValid = this.packageFolder.isValid();
      expect(isValid).to.eventually.not.be.ok;
    });
  });
});
