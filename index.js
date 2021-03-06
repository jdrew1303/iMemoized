/* iMemoized 
 * Copyright 2016, AnyWhichWay and Simon Y. Blackwell
 * Available under MIT license <https://mths.be/mit>
 */
(function() {
	"use strict";
	
	function iMemoized(constructorOrObject,excludeOrConfig,classMethods,keyProperty) {
		// ensure backward compatibility with <= v0.0.8
		const config = (excludeOrConfig && typeof(excludeOrConfig)==="object" ? excludeOrConfig : {exclude:excludeOrConfig,classMethods,keyProperty}),
			exclude = (config && config.exclude ? config.exclude : []),
			statistics = (config ? config.statistics : false);
		classMethods = (config ? config.classMethods : null);
		keyProperty = (config ? config.keyProperty :null);

		function memoize(object) {
			Object.keys(object).forEach(function(key) {
				if(exclude.indexOf(key)===-1 && typeof(object[key])==="function") {
					object[key] = iMemoized.memoize(object[key],{keyProperty,statistics});
				}
			});
			return object;
		}
	
		if(typeof(constructorOrObject)==="function") {
			if(classMethods) {
				memoize(constructorOrObject);
			}
			memoize(constructorOrObject.prototype);
			if(typeof(Proxy)!=="undefined") { 
				return new Proxy(constructorOrObject,{
					// ugly, poor style code because Safari is so far behind the standards
					construct: function(Target,argumentsList) {
						var instance = Object.create(Target.prototype);
						instance.constructor = Target;
						var result = Target.apply(instance,argumentsList);
						if(result) {
							return memoize(result);
						} else {
							return memoize(instance);
						}
						//return memoize(new Target(...argumentsList));
					}
				});
			}
		}
		return memoize(constructorOrObject);
	}
	iMemoized.memoize = function(f,keyPropertyOrConfig) {
		//  results is the results cache as a property of the memoized function mf
			/* 
			 *  it is an object that serves as an index leveraging thousands of hours of JavaScript engine optimization by Google, Mozilla, and others:
			 *  
			 *  function myFunction(arg1,arg2) { return arg1 + arg2; }
			 *  
			 *  these two calls:
			 *  
			 *  myFunction(1,2);
			 *  myFunction(1,"2");
			 *  
			 *  will result in an index:
			 *  
			 *  {1: {number: {2: {number: 3}}}, // 1 + 2 = 3
			 *               {2: {string: "12"}}} // 1 + "2" = "12";
			 *  
			 *  in the case of objects, the value keys will be the unique ids of the objects
			 */
		var statistics = (keyPropertyOrConfig && typeof(keyPropertyOrConfig)==="object" ? keyPropertyOrConfig.statistics : false),
			keyProperty = (keyPropertyOrConfig && typeof(keyPropertyOrConfig)==="object" && keyPropertyOrConfig.keyProperty ? keyPropertyOrConfig.keyProperty : "__memoid__");
			// we could use a function Proxy but tests have shown it would be 50% slower!
			function mf() { 
				var result = mf.results, exists = true, type;
				// result tracks the current node in the results index, initially set to the root, i.e. results
				// loop through all the arguments
				for(var i=0;i<arguments.length;i++) {
					var arg = arguments[i]; // Safari does not support let
					type = typeof(arg);
					if(arg && type==="object") {
						if(typeof(arg[mf.keyProperty])=="undefined" && mf.keyProperty==="__memoid__") {
							Object.defineProperty(arg,mf.keyProperty,{value:++mf.memoid});
						}
						arg = arg[mf.keyProperty];
					}
					if(typeof(result[arg])==="undefined") {
						result[arg] = {}; // create the argument key in the current index node
						exists = false;
					}
					if(typeof(result[arg][type])!=="undefined") { // of the correct type
						result = result[arg][type]; // descend to the node
					} else if(i<arguments.length-1) { // if not the last argument
						result[arg][type] = {}; // also create a type node
						result = result[arg][type]; // set the node to the newly created node
						exists = false;
					} else {
						result = result[arg]; // set the result to just	above what will be the last node
					}
					
				} // continue with the next argument
				if(exists) { // if a result was found
					if(statistics) {
						mf.statistics.hits++;
					}
					return result; // return hit
				}
				result[type] = f.apply(this,arguments); // otherwise cache the value with its type by actually calling the function
				if(statistics) {
					mf.statistics.initialized = new Date(); // set the initialization timestamp for the statistics
				}
				return result[type];
			}
		Object.defineProperty(mf,"results",{configurable:true,writable:true,enumerable:false,value:{}});
		Object.defineProperty(mf,"memoid",{configurable:true,writable:true,enumerable:false,value:0});
		Object.defineProperty(mf,"keyProperty",{configurable:true,writable:true,enumerable:false,value:keyProperty});
		if(statistics) {
			Object.defineProperty(mf,"statistics",{configurable:true,writable:true,enumerable:false,value: {hits:0,initialized:null}});
		}
		// poor style value: code because Safari is so far behind the standards
		Object.defineProperty(mf,"flush",{configurable:true,writable:true,enumerable:false,value: function(){ 
			mf.results = {};
			if(statistics) {
				mf.statistics.hits = 0;
				mf.statistics.initialized = null;
			}
		}});
		return mf;
	};

	if (typeof(module)!=="undefined") {
		module.exports  = iMemoized;
	} else {
		this.iMemoized = iMemoized;
	}
}).call(this);