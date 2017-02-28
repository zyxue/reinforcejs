import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

import Env from '../Env.js';
import {TDPredAgent} from '../../../lib/Reinforce-js';

import View from '../DP/View.jsx';

import Dashboard from './Dashboard.jsx';
// use the same grid from DP since they are all for prediction only
import Grid from '../DP/Grid.jsx';
import Agent from '../Components/Grid/Agent.jsx';
import Line from '../Components/Plot/Line.jsx';


class TDPredView extends View {
    constructor() {
        super();
        let env = new Env();
        let agent = new TDPredAgent(env);

        this.state = {
            agent: agent,
            env: env,
            selectedStateId: null,
            // legends control
            legCtrl: {
                stateId: true,
                stateCoord: false,
                reward: true,
                stateValue: true,
                etrace: true
            }
        };
    }

    updateAgent(attr, event) {
        let agent = this.state.agent;
        console.debug('updated ' + attr + ' to ' + event.target.value);
        agent[attr] = event.target.value;
        this.setState({agent: agent});
    }

    startLearning(key) {
        const actingRate = 1;
        const A = this.state.agent;
        const intervalId = setInterval (() => {
            switch (key) {
                case 'tdLambda':
                    A.act();
                    break;
                default:
                    console.error('unrecognized key: ', key);
            }
            this.setState({agent: A});
        }, actingRate);
        this.setState({intervalId: intervalId});
    }

    hdlAgentBtnClick(action) {
        const A = this.state.agent;
        switch(action) {
            case 'takeOneStep':
                A.act();
                break;
            case 'learnFromOneEpisode':
                A.learnFromOneEpisode();
                break;
            case 'learnFromMultipleEpisodes':
                A.learnFromMultipleEpisodes();
                break;
            case 'toggleTDLambda':
                this.toggleLearning('tdLambda');
                break;
            case 'reset':
                A.reset();
                break;
            default:
                console.log('action unspecified or unrecognized: ', action);
        }
        this.setState({agent: A});
    }


    render() {
        return (
            <div>
                <Row className="dashboard">
                    <Dashboard agent={this.state.agent}
                               updateAgent={this.updateAgent.bind(this)}
                               hdlAgentBtnClick={this.hdlAgentBtnClick.bind(this)}
                               updateEnv={this.updateEnv.bind(this)}
                               selectedStateId={this.state.selectedStateId}
                               hdlCellBtnClick={this.hdlCellBtnClick.bind(this)}
                               hdlCellRewardAdjustment={this.hdlCellRewardAdjustment.bind(this)}
                               legendsCtrl={this.state.legCtrl}
                               toggleLegend={this.toggleLegend.bind(this)}
                    />
                </Row>

                <Row>
                    <Col className='grid'  xs={12} md={8} >
                        <Grid height={600}
                              width={700}
                              id="grid-TD-control"
                              agent={this.state.agent}
                              selectedStateId={this.state.selectedStateId}
                              handleCellClick={this.hdlCellClick.bind(this)}
                              legendsCtrl={this.state.legCtrl}
                        />
                    </Col>

                    <Col className='plots' xs={12} md={4} >
                        plots placeholder
                        {/* <Line
                            height={150}
                            width={300}
                            margin={{top:0, left: 40, bottom:30}}
                            id={'policy-iteration-delta'}
                            data={this.state.agent.deltasPolIter}
                            xlabel={'# sweeps'}
                            ylabel={'pol iter delta'}
                            />


                            <Line
                            height={150}
                            width={300}
                            margin={{top:0, left: 40, bottom:30}}
                            id={'value-iteration-delta'}
                            data={this.state.agent.deltasValIter}
                            xlabel={'# sweeps'}
                            ylabel={'val iter delta'}
                            /> */}
                    </Col>
                </Row>

            <p>Evaluate a random policy π, i.e. taking a random action out of all allowed actions in each state</p>

            <div>
                <h2>Introduction</h2>
                <p>This is a gridworld to help understand how TD(λ) does state value evaluation. This page is all about prediction and NO control. There is no state-action value function (Q(s, a)) involved. For control, please go to TD-control. The policy is ε-greedy, and the action is generated by looking one step ahead into the value of the next state.</p>
                <ul>
                    <li>The agent always starts at the initial state, which defaults to State 0. It then try to navigate to the terminal state (green bound).</li>
                    <li>At each state, the agent has 4 actions (0: ←, 1: ↑, 2: ↓, 3: →). If it hits the walls or cliffs (grey), it stays put.</li>
                    <li>Yellow circle represents the current location of the agent, and its blue arrow represents the action it chooses for the next step from epsilon-greey policy.</li>
                    <li>For the meaning of numbers inside each rectangle, refer to Toggle legends section on the right.</li>
                    <li>You can start by clicking Act button and see how the agent moves one step at a time.</li>
                    <li>Then you can toggle continous action by clicking the Toggle button.</li>
                    <li>If it converges too slow, then hit Learn button to experience multiple episodes in batch without seeing how the agent acts. See how the first plot changes.</li>
                    <li>The second plot shows the episodic eligibility trace (Z) of one state (defaults to State 0). You can see that of a particular state by clicking the corresponding rectangle. An orange bound appears when a state is being selected.</li>
                    <li>The third plot shows a serial view of Z of all states at the current time. The same information is also shown on the grid with yellow circles of different sizes to reflect the difference among Z of different states. See how it diminishes as the agent is leaving the state further and further. The radii of circles are rescaled logarithmically to fit the rectangular better..</li>
                    <li>Gridworld is deterministic! So once the agent selects an action, its next state is deterministic.</li>
                    <li>You can also click on the agent to force it to change its action!</li>
                    <li>After the agent reachs the terminal state, it needs an additional step (basically action of any direction will do) to exit the terminal state and obtain the plus reward. Then the episode ends, and the agent is reinitialized to the starting state.</li>
                    <li>starting state, terminal state, cliffs, and rewards are all adjustable in cell control.</li>
                    <li>The right side below the plots are dashboard, where you can adjust different kinds of paramters. Some of them are:</li>
                    <ul>
                        <li>α: learning rate</li>
                        <li>γ: return discount factor</li>
                        <li>ε: the exploration rate as defined in ε-greedy policy. When ε = 0, it's greedy policy, NO exploration at all; when ε = 1, it's a random policy</li>
                        <li>λ: trace-decay parameter</li>
                        <li>Acting rate controls how fast the agent moves when toggle.</li>
                    </ul>

                    <li><strong>Instruction for agent control:</strong></li>
                    <ul>
                        <li>Act: take one action</li>
                        <li>Toggle: Take actions continously indefinitely</li>
                        <li>Learn: Learn from one batch ({this.state.agent.batchSize}) of episodes</li>
                    </ul>


                </ul>
            </div>



            </div>
        );
    }
}


export default TDPredView;
