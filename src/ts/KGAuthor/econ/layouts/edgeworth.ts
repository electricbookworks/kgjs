/// <reference path="../eg.ts" />

module KGAuthor {

    export class EdgeworthBoxPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let agentA = def['agentA'],
                agentB = def['agentB'],
                sidebarDef = def['sidebar'];

            let width = 0.738, height = 0.9;

            if(def.totalGood1 > def.totalGood2) {
                height = def.totalGood2*height/def.totalGood1;
            }

            if(def.totalGood2 > def.totalGood1) {
                height = def.totalGood1*width/def.totalGood2;
            }

            agentA.position = {
                "x": 0.15,
                "y": 0.05,
                "width": width,
                "height": height
            };

            agentB.position = {
                "x": 0.15 + width,
                "y": 0.05 + height,
                "width": -1*width,
                "height": -1*height
            };

            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';

            l.subObjects.push(new Graph(agentA));
            l.subObjects.push(new Graph(agentB));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }

    export class EdgeworthBoxPlusTwoGraphsPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let agentA = def['agentA'],
                agentB = def['agentB'],
                graph1 = def['graph1'],
                graph2 = def['graph2'],
                sidebarDef = def['sidebar'];

            let width = 0.738, height = 0.9;

            if(def.totalGood1 > def.totalGood2) {
                height = def.totalGood2*height/def.totalGood1;
            }

            if(def.totalGood2 > def.totalGood1) {
                height = def.totalGood1*width/def.totalGood2;
            }

            agentA.position = {
                "x": 0.15,
                "y": 0.05,
                "width": width,
                "height": height
            };

            agentB.position = {
                "x": 0.15 + width,
                "y": 0.05 + height,
                "width": -1*width,
                "height": -1*height
            };

            graph1.position = {
                "x": 0.1,
                "y": height+0.15,
                "width": 0.35,
                "height": 0.85-height
            };

            graph2.position = {
                "x": 0.6,
                "y": height+0.15,
                "width": 0.35,
                "height": 0.85-height
            };

            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';

            l.subObjects.push(new Graph(agentB));
            l.subObjects.push(new Graph(agentA));
            l.subObjects.push(new Graph(graph1));
            l.subObjects.push(new Graph(graph2));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }

    export class EdgeworthBoxPlusUPF extends WideRectangleLayout {

        constructor(def) {
            super(def);

            const l = this;
            let agentA = def['agentA'],
                agentB = def['agentB'],
                graph = def['graph'],
                sidebarDef = def['sidebar'];

            let width = 0.738, height = 0.9;

            if(def.totalGood1 > def.totalGood2) {
                height = def.totalGood2*height/def.totalGood1;
            }

            if(def.totalGood2 > def.totalGood1) {
                height = def.totalGood1*width/def.totalGood2;
            }

            agentA.position = {
                "x": 0.15,
                "y": 0.05,
                "width": width,
                "height": height
            };

            agentB.position = {
                "x": 0.15 + width,
                "y": 0.05 + height,
                "width": -1*width,
                "height": -1*height
            };

            graph.position = {
                "x": 0.1,
                "y": height+0.15,
                "width": 0.35,
                "height": 0.85-height
            };

            agentA.xAxis.max = agentB.xAxis.max = def.totalGood1;
            agentA.yAxis.max = agentB.yAxis.max = def.totalGood2;
            agentB.xAxis.orient = 'top';
            agentB.yAxis.orient = 'right';

            l.subObjects.push(new Graph(agentB));
            l.subObjects.push(new Graph(agentA));
            l.subObjects.push(new Graph(graph));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }






}