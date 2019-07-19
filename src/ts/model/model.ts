/// <reference path="../kg.ts" />

module KG {

    export interface IModel {
        eval: (name: string) => any;
        addUpdateListener: (updateListener: UpdateListener) => Model;
        getParam: (name: string) => any;
        updateParam: (name: string, value: any) => void;
        toggleParam: (name: string) => void;
        cycleParam: (name: string) => void;
        update: (force: boolean) => void;
    }

    export class Model implements IModel {

        private restrictions: Restriction[];
        private updateListeners: UpdateListener[];

        // objects that store definitions of params, calcs, and colors
        private params: Param[];
        private calcs: {};
        private colors: {};

        // objects that store current realized values of params, calcs, and colors
        public currentParamValues: {};
        public currentCalcValues: {};
        public currentColors: {};

        constructor(parsedData) {
            let model = this;
            model.params = parsedData.params.map(function (def) {
                return new Param(def)
            });
            model.calcs = parsedData.calcs;
            model.colors = parsedData.colors;
            model.restrictions = (parsedData.restrictions || []).map(function (def) {
                return new Restriction(def)
            });
            model.updateListeners = [];

            model.currentParamValues = model.evalParams();
            model.currentCalcValues = model.evalObject(model.calcs);
            model.currentColors = model.evalObject(model.colors);
        }

        addUpdateListener(updateListener: UpdateListener) {
            this.updateListeners.push(updateListener);
            return this;
        }

        evalParams() {
            let p: any = {};
            this.params.forEach(function (param) {
                p[param.name] = param.value;
            });
            return p;
        }

        evalObject(obj: {}) {
            const model = this;
            let newObj = {};
            for (const stringOrObj in obj) {
                const def = obj[stringOrObj];
                if (typeof def === 'string') {
                    newObj[stringOrObj] = model.eval(def)
                } else {
                    newObj[stringOrObj] = model.evalObject(def)
                }
            }
            return newObj;
        }

        // the model serves as a model, and can evaluate expressions within the context of that model
        eval(name: string) {

            const model = this;

            // don't just evaluate numbers
            if (!isNaN(parseFloat(name))) {
                //console.log('interpreted ', name, 'as a number.');
                return parseFloat(name);
            }

            // collect current values in a scope object
            const params = model.currentParamValues,
                calcs = model.currentCalcValues,
                colors = model.currentColors;


            // try to evaluate using mathjs
            try {
                const compiledMath = math.compile(name);
                let result = compiledMath.eval({
                    params: params,
                    calcs: calcs,
                    colors: colors
                });
                //console.log('parsed', name, 'as a pure math expression with value', result);
                return result;
            }

            catch
                (err) {

                // if that doesn't work, try to evaluate using native js eval
                //console.log('unable to parse', name, 'as a pure math function, trying general eval');

                try {
                    let result = eval(name);
                    //console.log('parsed', name, 'as an expression with value', result);
                    return result;
                }

                catch (err) {
                    //console.log('unable to parse', name,'as a valid expression; generates error:', err.message);
                    return name;
                }

            }

        }

        // This is a utility for exporting currently used colors for use in LaTex documents.
        latexColors() {
            let result = '%% econ colors %%\n', model = this;
            for (const color in model.colors) {
                result += `\\definecolor{${color}}{HTML}{${model.eval(model.colors[color]).replace('#', '')}}\n`
            }
            console.log(result)
        }

        getParam(paramName: string) {
            const params = this.params;
            for (let i = 0; i < params.length; i++) {
                if (params[i].name == paramName) {
                    return params[i];
                }
            }
        }


        // method exposed to viewObjects to allow them to try to change a parameter
        updateParam(name: string, newValue: any) {
            let model = this,
                param = model.getParam(name);
            const oldValue = param.value;
            param.update(newValue);
            // if param has changed, check to make sure the change is val
            if (oldValue != param.value) {

                //restrictions aren't working right now

                let valid = true;
                model.restrictions.forEach(function (r) {
                    if (!r.valid(model)) {
                        valid = false
                    }
                });
                if (valid) {
                    model.update(false);
                } else {
                    param.update(oldValue);
                }

                model.update(false);
            }
        }


        // method exposed to viewObjects to allow them to toggle a binary param
        toggleParam(name: string) {
            const currentValue = this.getParam(name).value;
            this.updateParam(name, !currentValue);
        }

        // method exposed to viewObjects to allow them to cycle a discrete param
        // increments by 1 if below max value, otherwise sets to zero
        cycleParam(name: string) {
            const param = this.getParam(name);
            this.updateParam(name, param.value < param.max ? param.value++ : 0);
        }


        update(force: boolean) {
            const model = this;
            model.currentParamValues = model.evalParams();
            console.log('calcs', model.currentCalcValues);
            model.currentCalcValues = model.evalObject(model.calcs);
            console.log('updatedCalcs', model.currentCalcValues);
            model.currentColors = model.evalObject(model.colors);
            model.updateListeners.forEach(function (listener) {
                listener.update(force)
            });
        }


    }

}