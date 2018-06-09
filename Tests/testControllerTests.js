/**
 * Created by Venugopal on 5/6/2016.
 */
var should = require('should'),
    sinon = require('sinon');

describe('Test Controller Tests:', function(){

    describe('Post',function(){
        it('should not allow ann empty title on post', function(){
            var  Test = function(test){this.save = function(){}}
            var req = {
                body:{
                    module:'random'
                }
            }

            var res = {
                status: sinon.spy(),
                send:sinon.spy()
            }

            var testController = require('../Controllers/testController')(Test);
            testController.post(req,res);
            res.status.calledWith(400).should.equal(true,'Wrong Status' + res.status.args[0][0]);
            res.send.calledWith('Module is Required').should.equal(true);
        })
    })
});