import _ from 'underscore';
import output from '../to-source';
import { toTokenArray } from '../to-tokens';
import evaluator from '../evaluator';

function TuroStatement (id, node, info, updateId) {
  this._id = id;
  this._node = node;
  /*
  info = {
    id: id,
    documentId: this.documentId,
    lineFirst: node.lineFirst,
    lineLast: node.lineLast,
    offsetFirst: node.statementOffsetFirst,
    offsetLast: node.statementOffsetLast,
  };
   */
  this._info = info;
  this._currentValue = null;
  this._errors = null;
  this._updateId = updateId;
}

Object.defineProperties(TuroStatement.prototype, {
  tokens: {
    get() {
      return this.toTokens();
    }
  },

  id: {
    get() {
      return this._id;
    }
  },

  errors: {
    get() {
      return this.node.errors;
    }
  },

  expression: {
    get() {
      var node = this._node;
      if (node.definition) {
        return node.definition;
      }
      return node;
    }
  },

  identifier: {
    get() {
      return this._node.identifier;
    }
  },

  info: {
    get() {
      return this._info;
    }
  },

  node: {
    get() {
      return this._node;
    }
  },

  currentValue: {
    get() {
      if (this._currentValue) {
        return this._currentValue;
      }
      this._currentValue = this.reevaluate();
      return this._currentValue;
    }
  },

  text: {
    get() {
      return this._info.text;
    },
  },
});

_.extend(TuroStatement.prototype, {
  isParseable () {
    return !!(this.node.accept) || this.node.isUnparsed;
  },

  hasErrors() {
    if (!this.isParseable()) {
      return true;
    }
    let value = this.currentValue;
    return this.errors && this.errors.length;
  },

  toTokens() {
    return toTokenArray(this.node);
  },

  valueToString (display, prefs) {
    return output.toStringWithDisplay(this.currentValue, display, prefs);
  },

  expressionToString (display, prefs) {
    return output.toStringWithDisplay(this.expression, display, prefs);
  },

  verboseToString (display, prefs) {
    if (!prefs) {
      prefs = { padding: ' '};
    }
    var t = [
      output.toStringWithDisplay(this.node, display, prefs),
      '=',
      this.valueToString(display, prefs)
    ];

    return t.join(' ');
  },

  errorToString (display) {

  },

  reevaluate () {
    if (!this.isParseable()) {
      return;
    }

    var currentValue = evaluator.evaluate(this.node);
    this._currentValue = currentValue;

    return currentValue;
  },

  toString(display, prefs) {
    return this.verboseToString(display, prefs);
  }
});

export default TuroStatement;