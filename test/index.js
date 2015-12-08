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
  'fs-extra': 'fs-extra'
};

const _ = 'A SUPER COOL FOLDER';

describe('For the Steve Package Folder', () => {
  beforeEach('Setup Spies', () => {
    stub(Promise, 'promisifyAll')
      .withArgs('fs-extra')
      .returns(this.fse = {
        ensureDir: this.ensureDirStub = stub(),
        rmdir: this.rmdirStub = stub(),
        mkdir: this.mkdirStub = stub()
      });
  });
  afterEach('Teardown Spies', () => {
    Promise.promisifyAll.restore();
  });
  beforeEach('Setup Package Folder', () => {
    let PackageFolder = proxyquire('./../index.js', proxyquireStubs);
    this.packageFolder = new PackageFolder(_);
  });
  describe('when #isValid() is called', () => {
    it('expect the constructor folder to be tested', () => {
      this.ensureDirStub.resolves();
      this.packageFolder.isValid();
      expect(this.ensureDirStub).to.have.been.calledWith(_);
    });
    it('expect it to be valid if it exists', () => {
      this.ensureDirStub.resolves();
      let isValid = this.packageFolder.isValid();
      expect(isValid).to.eventually.be.ok;
    });
    it('expect it to not be valid if there is any error', () => {
      this.ensureDirStub.rejects(new Error());
      let isValid = this.packageFolder.isValid();
      expect(isValid).to.eventually.not.be.ok;
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
    it('expect it to return any error when creation fails', () => {
      let error = new Error();
      this.rmdirStub.resolves();
      this.mkdirStub.rejects(error);
      let clear = this.packageFolder.clear();
      expect(clear).to.be.rejectedWith(error);
    });
    describe('and deletion fails', () => {
      it('expect it to be created if it doesn\'t exist', () => {
        this.rmdirStub.rejects({ code: 'ENOENT' });
        let clear = this.packageFolder.clear();
        expect(clear).to.be.fulfilled;
        return clear.then(() => expect(this.mkdirStub).to.have.been.calledWith(_));
      });
      it('expect any other error to be returned and it not to be created', () =>{
        let error = new Error();
        this.rmdirStub.rejects(error);
        let clear = this.packageFolder.clear();
        expect(clear).to.be.rejectedWith(error);
        return clear.catch(() => expect(this.mkdirStub).to.not.have.been.called);
      });
    });
  });
});
