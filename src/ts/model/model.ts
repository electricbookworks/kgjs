/// <reference path="../kg.ts" />

module KG {

    export interface IModel {
        params: any;
        eval: (name: string) => any;
        currentParamValues: () => {};
        updateListeners: UpdateListener[];
        addUpdateListener: (updateListener: UpdateListener) => Model;
    }

    export class Model implements IModel {

        public params;
        public updateListeners;

        constructor(params) {
            let model = this;
            model.params = params;
            model.updateListeners = [];
        }

        addUpdateListener(updateListener) {
            this.updateListeners.push(updateListener);
            return this;
        }

        currentParamValues() {
            let params = this.params;
            let p = {};
            for (const paramName in params) {
                if (params.hasOwnProperty(paramName)) {
                    p[paramName] = params[paramName].value;
                }
            }
            return p;
        }

        // the model serves as a model, and can evaluate expressions within the context of that model
        eval(name) {
            let p = this.params;

            // don't just evaluate numbers
            if (typeof name == 'number') {
                //console.log('parsed', name, 'as a number');
                return name;
            }

            // check to see if name is a param
            else if (p.hasOwnProperty(name)) {
                //console.log('parsed', name, 'as a parameter');
                return p[name].value
            }

            // collect current parameter values in a p object
            let params = this.currentParamValues();



            // establish a function, usable by eval, that uses mathjs to parse a string in the context of p
            let v = function (s) {
                let compiledMath = math.compile(s);
                let parsedMath = compiledMath.eval();
                return parsedMath;
            };

            // try to evaluate using mathjs
            try {
                let result = v(name);
                //console.log('parsed', name, 'as a pure math expression with value', result);
                return result;
            }
            catch (err) {

                // if that doesn't work, try to evaluate using native js eval
                //console.log('unable to parse', name, 'as a pure math function, trying general eval');

                try {
                    let result = eval(name);
                    //console.log('parsed', name, 'as an expression with value', result);
                    return result;
                }

                catch (err) {
                    // if that doesn't work, try to evaluate using native js eval
                    //console.log('unable to parse', name,'as a valid expression; generates error:', err.message);
                    return name;
                }

            }

        }


        // method exposed to viewObjects to allow them to try to change a parameter
        updateParam(name, newValue) {
            let model = this;
            if (model.params.hasOwnProperty(name)) {
                const oldValue = model.params[name].value;
                model.params[name].update(newValue);

                // if param has changed, propagate change to fields and children
                if (oldValue != model.params[name].value) {
                    model.update(false);
                }
            }
        }

        update(force) {
            this.updateListeners.forEach(function (listener) {
                listener.update(force)
            });
            return 'updated';
        }


    }

}