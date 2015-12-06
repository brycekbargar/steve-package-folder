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
  this.lstatStub = stub();
  proxyquireStubs['fs'] = { lstat: this.lstatStub };
});
beforeEach('Setup File', () => this.folder = proxyquire('./../index.js', proxyquireStubs));
describe('when loading the folder', () => {
  it('expect the folder to be passed', () => {
    let folderPath = 'THE BEST FOLDER EVER! PROBABLY CONTAINS BANANA PANCAKES!!!';
    this.folder(folderPath, () => {});
    expect(this.lstatStub).to.have.been.calledOnce;
    expect(this.lstatStub).to.have.been.calledWith(folderPath);
  });
  it('and it fails expect an error', () => {
    let error = new Error();
    this.lstatStub.callsArgWith(1, error);

    this.folder(_, this.callbackSpy);
    expect(this.callbackSpy).to.have.been.calledOnce;
    expect(this.callbackSpy).to.have.been.calledWith(error);
  });
});
