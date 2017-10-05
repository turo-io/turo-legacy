'use strict';
var _ = require('underscore'),
    turoNumber = require('../turo-number'),
    mixins = require('./mixins'),

    makeMixin = mixins.makeMixin,
    isDimensionless = mixins.isDimensionless;
    
var number = 'number';


/////////////////////////////////////////////////////////////////////////////////////////////

module.exports.registerOperators = function registerOperators (ops) {

  ops.addInfixOperator(
    '+', number, number, number,
    [
      mixins.binaryMatchingUnits,
      {
        simpleValueCalculator: function (a, b) {
          return a + b;
        }
      }
    ]
  );

  ops.addInfixOperator(
    '-', number, number, number,
    [
      mixins.binaryMatchingUnits,
      {
        simpleValueCalculator: function (a, b) {
          return a - b;
        }
      }
    ]
  );

  ops.addInfixOperator(
    '*', number, number, number,
    [
      mixins.binaryAnyUnits,
      {
        unitCalculator: function (leftValue, rightValue) {
          if (isDimensionless(leftValue)) {
            return rightValue.unit;
          }
          if (isDimensionless(rightValue)) {
            return leftValue.unit;
          }
          return leftValue.unit.by(rightValue.unit);
        },
        simpleValueCalculator: function (a, b) {
          return a * b;
        }
      }
    ]
  );

  ops.addInfixOperator(
    '/', number, number, number, 
    makeMixin(
      function (a, b) {
        return a / b;
      },
      mixins.binaryAnyUnits,
      mixins.binaryDivideUtils
    )
  );

  // unary -
  ops.addPrefixOperator(
    '-', number, number, 
    makeMixin(
      function (x) {
        return -x;
      },
      mixins.unaryIdentity
    )
  );

  // unary +
  ops.addPrefixOperator(
    '+', number, number, [
      mixins.unaryIdentity,
    ]
  );

  ops.addInfixOperator(
    'in', number, 'unit', number,
    [
      {
        preflightCheck: function (leftNode, leftValue, rightNode, rightValue, ctx) {
          return (!isDimensionless(leftValue) && leftValue.unit.matchesDimensions(rightValue.unit));
        },

        turoValueCalculator: function (leftValue, rightValue) {
          return leftValue.convert(rightValue.unit);
        }
      },
    ]
  );
};

