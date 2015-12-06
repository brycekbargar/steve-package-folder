'use strict';

const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const spy = sinon.spy;
const stub = sinon.stub;
const expect = require('chai').use(require('sinon-chai')).expect;

const proxyquireStubs = { };

const _ = '';

beforeEach('Setup Spies', () => {
  this.callbackSpy = spy();
  this.mkdirStub = stub();
  proxyquireStubs['fs'] = { mkdir: this.mkdirStub };
});
beforeEach('Setup File', () => this.folder = proxyquire('./../index.js', proxyquireStubs));
describe('when loading the folder', () => {
  it('expect the folder to be passed', () => {
    let folderPath = 'THE BEST FOLDER EVER! PROBABLY CONTAINS BANANA PANCAKES!!!';
    this.folder(folderPath, () => {});
    expect(this.mkdirStub).to.have.been.calledOnce;
    expect(this.mkdirStub).to.have.been.calledWith(folderPath);
  });
  describe('and it fails', () => {
    it('expect no error if it exists', () => {
      let error = { code: 'EEXIST' };
      this.mkdirStub.callsArgWith(1, error);
      this.folder(_, this.callbackSpy);
      expect(this.callbackSpy).to.have.been.calledOnce;
      expect(this.callbackSpy).to.have.been.calledWith(null);
    });
    it('expect an error for any other failure', () => {
      let error = new Error();
      this.mkdirStub.callsArgWith(1, error);
      this.folder(_, this.callbackSpy);
      expect(this.callbackSpy).to.have.been.calledOnce;
      expect(this.callbackSpy).to.have.been.calledWith(error);
    });
  });
});
