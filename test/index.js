var expect, iMemoized;
if(typeof(window)==="undefined") {
	expect = require("chai").expect;
	iMemoized = require("../index.js");
}

var fibonacci = function(n) {
    return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}


function Calculator() {
	
}
Calculator.prototype.multiply = function() {
	var result = 1,
		args = [].slice.call(arguments);
	args.forEach((arg) => {
		result *= arg;
	});
	return result;
}
Calculator.prototype.volume = function(object) {
	return object.length * object.width * object.height;
}
var mfibonacci = iMemoized.memoize(fibonacci),
	calculator = new Calculator(),
	MCalculator = iMemoized(Calculator,[],false,"id"),
	mcalculator = new MCalculator(),
	box = {
		length: 10,
		width: 10,
		height: 10,
		id:1
	};

describe("iMemoized ", function() {
	it("memoizes functions",() => {
		expect(fibonacci(5)).to.equal(mfibonacci(5));
		expect(fibonacci(5)).to.equal(mfibonacci(5));
	});
	describe("memoizes classes",() => {
		it("supports multiple arguments",() => {
			expect(calculator.multiply(1,2,3)).to.equal(mcalculator.multiply(1,2,3));
			expect(calculator.multiply(1,2,3)).to.equal(mcalculator.multiply(1,2,3));
		});
		it("supports objects",() => {
			expect(calculator.volume(box)).to.equal(mcalculator.volume(box));
			expect(calculator.volume(box)).to.equal(mcalculator.volume(box));
		});
	});
});