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
      this.isDirectoryStub = stub();
      this.statStub.resolves({ isDirectory : this.isDirectoryStub });
      this.promisifyStub.withArgs('stat').returns(this.statStub);
    });
    it('expect the constructor folder to be tested', () => {
      this.packageFolder.isValid();
      expect(this.statStub).to.have.been.calledOnce;
      expect(this.statStub).to.have.been.calledWith(_);
    });
    describe('expect it to be valid if', () => {
      it('the folder is missing', () => {
        this.statStub.rejects({ code: 'ENOENT' });
        let isValid = this.packageFolder.isValid();
        expect(isValid).to.eventually.be.ok;
      });
      // I'm not testing the mode because that seems hard
      it('it is a folder', () => {
        this.isDirectoryStub.returns(true);
        let isValid = this.packageFolder.isValid();
        expect(isValid).to.eventually.be.ok;
      });
    });
    describe('expect it to not be valid if', () => {
      it('it fails for any other reason', () => {
        this.statStub.rejects(new Error());
        let isValid = this.packageFolder.isValid();
        expect(isValid).to.eventually.not.be.ok;
      });
      it('it is not a folder', () => {
        this.isDirectoryStub.returns(false);
        let isValid = this.packageFolder.isValid();
        expect(isValid).to.eventually.not.be.ok;
      });
    });
  });
});
