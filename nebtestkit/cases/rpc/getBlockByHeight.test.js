'use strict';
var expect = require('chai').expect;
var rpc_client = require('./rpc_client/rpc_client.js');

var protocol_version = '/neb/1.0.0'
var node_version = '0.7.0'
var server_address = 'localhost:8684';
var coinbase = "eb31ad2d8a89a0ca6935c308d5425730430bc2d63f2573b8";
var chain_id = 100;
var env = '';
if (env === 'testneb1') {
  server_address = 'http://35.182.48.19:8684';
  coinbase = "0b9cd051a6d7129ab44b17833c63fe4abead40c3714cde6d";
  chain_id = 1001;
} else if (env === "testneb2") {
  server_address = "http://34.205.26.12:8685";
  coinbase = "0b9cd051a6d7129ab44b17833c63fe4abead40c3714cde6d";
  chain_id = 1002;
}

var client;
var normalOutput;

function testRpc(testInput, testExpect, done) {
  client.getBlockByHeight(testInput.rpcInput, function (err, response) {
    if (err != null) {
      try {
        expect(testExpect.errMsg).to.be.equal(err.details);
      } catch (err) {
        console.log(err);
        done(err)
        return;
      }
      console.log(err);
      done();
      return;
    } else {
      try {
        if (testInput.isNormal) {
            console.log(response);
        //TODO:verify response
        //  expect(response.balance).to.be.a("string");
          normalOutput = response;
        } else {
          if (testExpect.isNormalOutput) {
            expect(JSON.stringify(response)).to.be.equal(JSON.stringify(normalOutput));
          } else {
            expect(testExpect.isNormalOutput).to.be.equal(false);
            expect(JSON.stringify(response)).not.be.equal(JSON.stringify(normalOutput));
          }     
        }
      } catch (err
      ) {
        done(err);
        return;
      };
    }
    done();
    return;
  });

}

describe('rpc: getBlockByHeight', function () {
  before(function () {
    client = rpc_client.new_client(server_address);
  });

  it('normal rpc', function (done) {
    var testInput = {
      rpcInput: {
        height: 1
      },
      isNormal: true
    }

    var testExpect = {
      isNormalOutput: true
    }
    
    testRpc(testInput, testExpect, done);
  })

  it('height is empty', function (done) {
    var testInput = {
      rpcInput: {
        
      },
      isNormal: false
    }

    var testExpect = {
      errMsg: 'block not found'
    }
    
    testRpc(testInput, testExpect, done);
  })

  it('height is neg', function (done) {
    var testInput = {
      rpcInput: {
        height: -1,
      },
      isNormal: false
    }

    var testExpect = {
      errMsg: 'block not found'
    }
    
    testRpc(testInput, testExpect, done);
  })

  it('height out of max', function (done) {
    var testInput = {
      rpcInput: {
        height: 1111111111111111111111111111111111111111111111111111111
      },
      isNormal: false
    }

    var testExpect = {
        errMsg: 'block not found'
    }
    
    testRpc(testInput, testExpect, done);
  })

  it('height is zero', function (done) {
    var testInput = {
      rpcInput: {
        height: 0
      },
      isNormal: false
    }

    var testExpect = {
        errMsg: 'block not found'
    }
    
    testRpc(testInput, testExpect, done);
  });

  it('height is positive', function (done) {
    var testInput = {
      rpcInput: {
        height: 3
      },
      isNormal: false
    }

    var testExpect = {
        isNormalOutput: false
    }
    
    testRpc(testInput, testExpect, done);
  });

});