import { expect } from 'chai';
import 'mocha';

import GraphingEngine from './GraphingEngine';
import GraphNode from './GraphNode';

let engine: GraphingEngine;

describe('Graphing engine', () => {

    describe('Create graph', () => {
        before(() => {
            engine = new GraphingEngine(null, null, () => { });
        });

        it('is empty', () => {
            expect(engine.getNodeCount()).to.equal(0);
            expect(engine.getEdgeCount()).to.equal(0);
        });
    })

    describe('Add nodes', () => {
        before(() => {
            engine = new GraphingEngine(null, null, () => { });
        });

        it('adds first node', () => {
            const res = engine.addNode(new GraphNode(0, 0));
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(1);
            expect(engine.getEdgeCount()).to.equal(0);
        });

        it('fails to add null', () => {
            const res = engine.addNode(null);
            expect(res).to.be.false;
            expect(engine.getNodeCount()).to.equal(1);
            expect(engine.getEdgeCount()).to.equal(0);
        });

        it('fails to add undefined', () => {
            const res = engine.addNode(undefined);
            expect(res).to.be.false;
            expect(engine.getNodeCount()).to.equal(1);
            expect(engine.getEdgeCount()).to.equal(0);
        });

        it('adds second node', () => {
            const res = engine.addNode(new GraphNode(-1, -1));
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(2);
            expect(engine.getEdgeCount()).to.equal(0);
        });
    });

    describe('Add edges', () => {
        before(() => {
            engine = new GraphingEngine(null, null, () => { });
            engine.addNode(new GraphNode(0, 0));
            engine.addNode(new GraphNode(-1, -1));
        });

        it('adds first edge', () => {
            const res = engine.addEdge(engine.nodes[0], engine.nodes[1]);
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(2);
            expect(engine.getEdgeCount()).to.equal(1);
        });

        it('fails to add null', () => {
            const res = engine.addEdge(engine.nodes[0], null);
            expect(res).to.be.false;
            expect(engine.getNodeCount()).to.equal(2);
            expect(engine.getEdgeCount()).to.equal(1);
        });

        it('fails to add undefined', () => {
            const res = engine.addEdge(undefined, engine.nodes[0]);
            expect(res).to.be.false;
            expect(engine.getNodeCount()).to.equal(2);
            expect(engine.getEdgeCount()).to.equal(1);
        });

        it('adds second edge', () => {
            const res = engine.addEdge(engine.nodes[0], engine.nodes[1]);
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(2);
            expect(engine.getEdgeCount()).to.equal(2);
        });

        it('adds second node and third edge', () => {
            const res1 = engine.addNode(new GraphNode(2, 2));
            const res2 = engine.addEdge(engine.nodes[1], engine.nodes[2]);
            expect(res1).to.be.true;
            expect(res2).to.be.true;
            expect(engine.getNodeCount()).to.equal(3);
            expect(engine.getEdgeCount()).to.equal(3);
        });
    });

    describe('Delete nodes', () => {
        beforeEach(() => {
            engine = new GraphingEngine(null, null, () => { });
            engine.addNode(new GraphNode(0, 0));
            engine.addNode(new GraphNode(-1, -1));
            engine.addNode(new GraphNode(2, 2));
            engine.addEdge(engine.nodes[0], engine.nodes[1]);
            engine.addEdge(engine.nodes[0], engine.nodes[1]);
            engine.addEdge(engine.nodes[1], engine.nodes[2]);
        });

        it('deletes first node', () => {
            const res = engine.deleteNodes([engine.nodes[0]]);
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(2);
            expect(engine.getEdgeCount()).to.equal(1);
        });

        it('deletes first and second node at once', () => {
            const res = engine.deleteNodes([engine.nodes[0], engine.nodes[1]]);
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(1);
            expect(engine.getEdgeCount()).to.equal(0);
        });

        it('deletes first and second node separately', () => {
            const res1 = engine.deleteNodes([engine.nodes[0]]);
            const res2 = engine.deleteNodes([engine.nodes[1]])
            expect(res1).to.be.true;
            expect(res2).to.be.true;
            expect(engine.getNodeCount()).to.equal(1);
            expect(engine.getEdgeCount()).to.equal(0);
        });

        it('skips on nodes not in graph', () => {
            const res = engine.deleteNodes([null, undefined, new GraphNode(0, 0), , new GraphNode(2, -10)]);
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(3);
            expect(engine.getEdgeCount()).to.equal(3);
        });
    });

    describe('Delete edges', () => {
        beforeEach(() => {
            engine = new GraphingEngine(null, null, () => { });
            engine.addNode(new GraphNode(0, 0));
            engine.addNode(new GraphNode(-1, -1));
            engine.addNode(new GraphNode(2, 2));
            engine.addEdge(engine.nodes[0], engine.nodes[1]);
            engine.addEdge(engine.nodes[0], engine.nodes[1]);
            engine.addEdge(engine.nodes[1], engine.nodes[2]);
        });

        it('deletes e_{0,1}', () => {
            const res = engine.deleteEdge(engine.nodes[0], engine.nodes[1]);
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(3);
            expect(engine.getEdgeCount()).to.equal(2);
        });

        it('deletes e_{1,0}', () => {
            const res = engine.deleteEdge(engine.nodes[1], engine.nodes[0]);
            expect(res).to.be.true;
            expect(engine.getNodeCount()).to.equal(3);
            expect(engine.getEdgeCount()).to.equal(2);
        });

        it('deletes e_{0,1} and e_{1, 2}', () => {
            const res1 = engine.deleteEdge(engine.nodes[0], engine.nodes[1]);
            const res2 = engine.deleteEdge(engine.nodes[1], engine.nodes[2]);
            expect(res1).to.be.true;
            expect(res2).to.be.true;
            expect(engine.getNodeCount()).to.equal(3);
            expect(engine.getEdgeCount()).to.equal(1);
        });

        it('fails to delete on nodes not in graph', () => {
            const res1 = engine.deleteEdge(engine.nodes[0], null);
            const res2 = engine.deleteEdge(new GraphNode(0, 0), engine.nodes[2]);
            const res3 = engine.deleteEdge(undefined, new GraphNode(10, 0));
            expect(res1).to.be.false;
            expect(res2).to.be.false;
            expect(res3).to.be.false;
            expect(engine.getNodeCount()).to.equal(3);
            expect(engine.getEdgeCount()).to.equal(3);
        });

        it('fails to delete on edges not in graph', () => {
            const res1 = engine.deleteEdge(engine.nodes[0], engine.nodes[2]);
            expect(res1).to.be.false;
            expect(engine.getNodeCount()).to.equal(3);
            expect(engine.getEdgeCount()).to.equal(3);
        });
    });
});