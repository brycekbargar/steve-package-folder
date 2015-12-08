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
        remove: this.removeStub = stub()
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
      this.removeStub.resolves();
      this.ensureDirStub.resolves();
      let clear = this.packageFolder.clear();
      expect(clear).to.be.fulfilled;
      return clear.then(() => {
        expect(this.removeStub).to.have.been.calledWith(_);
        expect(this.ensureDirStub).to.have.been.calledWith(_);
      });
    });
    describe('expect it to return an error', () => {
      it('when deletion fails', () =>{
        let error = new Error();
        this.removeStub.rejects(error);
        let clear = this.packageFolder.clear();
        expect(clear).to.be.rejectedWith(error);
      });
      it('when creation fails', () => {
        let error = new Error();
        this.removeStub.resolves();
        this.ensureDirStub.rejects(error);
        let clear = this.packageFolder.clear();
        expect(clear).to.be.rejectedWith(error);
      });
    });
  });
});
