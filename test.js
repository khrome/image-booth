var should = require("should");
var fs = require("fs");
var booth = require('./image-booth');

describe('image-booth', function(){
    it('something', function(done){
        var image = booth.newImage({
            source : './adder.jpg'
        });
        /*
        image.save('./png_output.png', function(err){
            //should.not.exist(err);
            //done();
        });
        //*/
    });
});