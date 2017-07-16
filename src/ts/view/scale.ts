/// <reference path="../kg.ts" />

module KG {

    export interface ScaleDefinition extends UpdateListenerDefinition {
        name: string;
        domainMin: any;
        domainMax: any;
        rangeMin: any;
        rangeMax: any;
        range: { min: number; max: number; }; // fractional amounts of enclosing view dimension
    }

    export interface IScale {
        scale: d3.ScaleLinear<Range, Range>
    }

    export class Scale extends UpdateListener implements IScale {

        public name;
        public scale;
        public domainMin;
        public domainMax;
        public rangeMin;
        public rangeMax;
        public extent;

        constructor(def: ScaleDefinition) {
            def.constants = ['rangeMin','rangeMax','axis','name'];
            def.updatables = ['domainMin', 'domainMax'];
            super(def);
            this.scale = d3.scaleLinear();
            this.update(true);
        }

        update(force) {
            let s = super.update(force);
            if (s.extent != undefined) {
                const rangeMin = s.rangeMin * s.extent,
                    rangeMax = s.rangeMax * s.extent;
                s.scale.domain([s.domainMin, s.domainMax]);
                s.scale.range([rangeMin, rangeMax]);
            }
            return s;
        }

    }

}