import { expect } from 'chai';
import 'mocha';

import GraphingEngine from './GraphingEngine';
import * as generator from './generator';

let engine: GraphingEngine;

describe('Common generators', () => {

    describe('One generator', () => {
        
        describe('Create complete', () => {
            beforeEach(() => {
                engine = new GraphingEngine(null, null, () => { });
            });

            it('creates K_1', () => {
                const res = generator.createComplete(engine, 1);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(1);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('creates K_5', () => {
                const res = generator.createComplete(engine, 5);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(5);
                expect(engine.getEdgeCount()).to.equal(10);
            });

            it('fails to create K_0', () => {
                const res = generator.createComplete(engine, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create K_{-1}', () => {
                const res = generator.createComplete(engine, -1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });
        });

        describe('Create bipartite complete', () => {
            beforeEach(() => {
                engine = new GraphingEngine(null, null, () => { });
            });

            it('creates K_{1,1}', () => {
                const res = generator.createBipartiteComplete(engine, 1, 1);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(2);
                expect(engine.getEdgeCount()).to.equal(1);
            });

            it('creates K_{5,3}', () => {
                const res = generator.createBipartiteComplete(engine, 5, 3);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(8);
                expect(engine.getEdgeCount()).to.equal(15);
            });

            it('creates K_{3,5}', () => {
                const res = generator.createBipartiteComplete(engine, 3, 5);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(8);
                expect(engine.getEdgeCount()).to.equal(15);
            });

            it('fails to create K_{0,5}', () => {
                const res = generator.createBipartiteComplete(engine, 0, 5);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create K_{5,0}', () => {
                const res = generator.createBipartiteComplete(engine, 5, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create K_{0,0}', () => {
                const res = generator.createBipartiteComplete(engine, 0, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create K_{-1,0}', () => {
                const res = generator.createBipartiteComplete(engine, -1, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create K_{0,-1}', () => {
                const res = generator.createBipartiteComplete(engine, 0, -1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });
        });

        describe('Create cycle', () => {
            beforeEach(() => {
                engine = new GraphingEngine(null, null, () => { });
            });

            it('creates C_3', () => {
                const res = generator.createCycle(engine, 3);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(3);
                expect(engine.getEdgeCount()).to.equal(3);
            });

            it('creates C_5', () => {
                const res = generator.createCycle(engine, 5);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(5);
                expect(engine.getEdgeCount()).to.equal(5);
            });

            it('fails to create C_2', () => {
                const res = generator.createCycle(engine, 2);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create C_1', () => {
                const res = generator.createCycle(engine, 1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create C_0', () => {
                const res = generator.createCycle(engine, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create C_{-1}', () => {
                const res = generator.createCycle(engine, -1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });
        });

        describe('Create star', () => {
            beforeEach(() => {
                engine = new GraphingEngine(null, null, () => { });
            });

            it('creates S_4', () => {
                const res = generator.createStar(engine, 4);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(4);
                expect(engine.getEdgeCount()).to.equal(3);
            });

            it('creates S_10', () => {
                const res = generator.createStar(engine, 10);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(10);
                expect(engine.getEdgeCount()).to.equal(9);
            });

            it('fails to create S_3', () => {
                const res = generator.createStar(engine, 3);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create S_2', () => {
                const res = generator.createStar(engine, 2);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create S_1', () => {
                const res = generator.createStar(engine, 1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create S_0', () => {
                const res = generator.createStar(engine, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create S_{-1}', () => {
                const res = generator.createStar(engine, -1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });
        });

        describe('Create wheel', () => {
            beforeEach(() => {
                engine = new GraphingEngine(null, null, () => { });
            });

            it('creates W_4', () => {
                const res = generator.createWheel(engine, 4);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(4);
                expect(engine.getEdgeCount()).to.equal(6);
            });

            it('creates W_10', () => {
                const res = generator.createWheel(engine, 10);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(10);
                expect(engine.getEdgeCount()).to.equal(18);
            });

            it('fails to create W_3', () => {
                const res = generator.createWheel(engine, 3);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create W_2', () => {
                const res = generator.createWheel(engine, 2);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create W_1', () => {
                const res = generator.createWheel(engine, 1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create W_0', () => {
                const res = generator.createWheel(engine, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create W_{-1}', () => {
                const res = generator.createWheel(engine, -1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });
        });

        describe('Create grid', () => {
            beforeEach(() => {
                engine = new GraphingEngine(null, null, () => { });
            });

            it('creates G_{1,1}', () => {
                const res = generator.createGrid(engine, 1, 1);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(1);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('creates G_{5,3}', () => {
                const res = generator.createGrid(engine, 5, 3);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(15);
                expect(engine.getEdgeCount()).to.equal(22);
            });

            it('creates G_{3,5}', () => {
                const res = generator.createGrid(engine, 3, 5);
                expect(res).to.be.true;
                expect(engine.getNodeCount()).to.equal(15);
                expect(engine.getEdgeCount()).to.equal(22);
            });

            it('fails to create G_{0,5}', () => {
                const res = generator.createGrid(engine, 0, 5);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create G_{5,0}', () => {
                const res = generator.createGrid(engine, 5, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create G_{0,0}', () => {
                const res = generator.createGrid(engine, 0, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create G_{-1,0}', () => {
                const res = generator.createGrid(engine, -1, 0);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });

            it('fails to create G_{0,-1}', () => {
                const res = generator.createGrid(engine, 0, -1);
                expect(res).to.be.false;
                expect(engine.getNodeCount()).to.equal(0);
                expect(engine.getEdgeCount()).to.equal(0);
            });
        });
    });

    describe('Multiple generators', () => {

        before(() => {
            engine = new GraphingEngine(null, null, () => { });
        });

        it('updates engine', () => {
            generator.createComplete(engine, 5);
            expect(engine.getNodeCount()).to.equal(5);
            expect(engine.getEdgeCount()).to.equal(10);

            generator.createComplete(engine, 4);
            expect(engine.getNodeCount()).to.equal(9);
            expect(engine.getEdgeCount()).to.equal(16);

            generator.createComplete(engine, -1);
            expect(engine.getNodeCount()).to.equal(9);
            expect(engine.getEdgeCount()).to.equal(16);

            generator.createBipartiteComplete(engine, 2, 3);
            expect(engine.getNodeCount()).to.equal(14);
            expect(engine.getEdgeCount()).to.equal(22);

            generator.createCycle(engine, 7);
            expect(engine.getNodeCount()).to.equal(21);
            expect(engine.getEdgeCount()).to.equal(29);

            generator.createStar(engine, 4);
            expect(engine.getNodeCount()).to.equal(25);
            expect(engine.getEdgeCount()).to.equal(32);

            generator.createWheel(engine, 12);
            expect(engine.getNodeCount()).to.equal(37);
            expect(engine.getEdgeCount()).to.equal(54);

            generator.createGrid(engine, 2, 2);
            expect(engine.getNodeCount()).to.equal(41);
            expect(engine.getEdgeCount()).to.equal(58);

            generator.createComplete(engine, 6);
            expect(engine.getNodeCount()).to.equal(47);
            expect(engine.getEdgeCount()).to.equal(73);

            generator.createComplete(engine, -3);
            expect(engine.getNodeCount()).to.equal(47);
            expect(engine.getEdgeCount()).to.equal(73);
        });
    });
});