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
  'fs-extra': 'fs-extra',
  path: require('path')
};

const _ = '/the/coolest/folder/ever/';

describe('For the Steve Package Folder', () => {
  beforeEach('Setup Spies', () => {
    stub(Promise, 'promisifyAll')
      .withArgs('fs-extra')
      .returns(this.fse = {
        ensureDirAsync: this.ensureDirStub = stub(),
        removeAsync: this.removeStub = stub(),
        copyAsync: this.copyStub = stub()
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
    describe('expect it to return an error when', () => {
      it('deletion fails', () =>{
        let error = new Error();
        this.removeStub.rejects(error);
        let clear = this.packageFolder.clear();
        expect(clear).to.be.rejectedWith(error);
      });
      it('creation fails', () => {
        let error = new Error();
        this.removeStub.resolves();
        this.ensureDirStub.rejects(error);
        let clear = this.packageFolder.clear();
        expect(clear).to.be.rejectedWith(error);
      });
    });
  });
  describe('when #add() is called', () =>{
    it('expect the file to be copied with the prefix', () => {
      this.copyStub.resolves();
      let filePath = '/a/file/about/pancakes.ck';
      let add = this.packageFolder.add(56, filePath);
      expect(add).to.be.fulfilled;
      expect(this.copyStub).to.have.been.calledWith(filePath, _ + '056_pancakes.ck' );
    });
    it('expect it to return any errors', () => {
      let error = new Error();
      this.copyStub.rejects(error);
      let add = this.packageFolder.add();
      expect(add).to.be.rejectedWith(error);
    });
  });
});
