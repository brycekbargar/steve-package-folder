'use strict';

const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const Promise = require('bluebird');
require('sinon-as-promised')(Promise);
const stub = sinon.stub;
const expect = require('chai')
  .use(require('sinon-chai'))
  .use(require('chai-as-promised'))
  .expect;

const proxyquireStubs = {
  bluebird: Promise,
  fs: {
    stat: 'stat',
    rmdir: 'rmdir',
    mkdir: 'mkdir'
  }
};

const _ = 'A SUPER COOL FOLDER';

describe('For the Steve Package Folder', () => {
  beforeEach('Setup Spies', () => {
    this.promisifyStub = stub(Promise, 'promisify');
    this.promisifyStub.withArgs('stat').returns(this.statStub = stub());
    this.promisifyStub.withArgs('rmdir').returns(this.rmdirStub = stub());
    this.promisifyStub.withArgs('mkdir').returns(this.mkdirStub = stub());
    this.statStub.resolves({ isDirectory : (this.isDirectoryStub = stub()) });
  });
  afterEach('Teardown Spies', () => {
    this.promisifyStub.restore();
  });
  beforeEach('Setup Package Folder', () => {
    let PackageFolder = proxyquire('./../index.js', proxyquireStubs);
    this.packageFolder = new PackageFolder(_);
  });
  describe('when #isValid() is called', () => {
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
  describe('when #clear() is called', () => {
    it('expect it to be deleted and created', () => {
      this.rmdirStub.resolves();
      this.mkdirStub.resolves();
      let clear = this.packageFolder.clear();
      expect(clear).to.be.fulfilled;
      return clear.then(() => {
        expect(this.rmdirStub).to.have.been.calledWith(_);
        expect(this.mkdirStub).to.have.been.calledWith(_);
      });
    });
    describe('and deletion fails', () => {
      it('expect it to be created it doesn\'t exist', () => {
        this.rmdirStub.rejects({ code: 'ENOENT' });
        let clear = this.packageFolder.clear();
        expect(clear).to.be.fulfilled;
        return clear.then(() => {
          expect(this.rmdirStub).to.have.been.calledWith(_);
          expect(this.mkdirStub).to.have.been.calledWith(_);
        });
      });
      it('expect any other error to be returned and it not to be created', () =>{
        let error = new Error();
        this.rmdirStub.rejects(error);
        let clear = this.packageFolder.clear();
        expect(clear).to.be.rejectedWith(error);
        return clear.catch(() => {
          expect(this.rmdirStub).to.have.been.calledWith(_);
          expect(this.mkdirStub).to.not.have.been.called;
        });
      });
    });
  });
});
