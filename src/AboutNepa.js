import React from 'react';
import './aboutNepa.css';

import {Link} from 'react-router-dom';

class AboutNepa extends React.Component {
    
    render () {
        return (
            <div>
                <div id="about-nepa-banner"> </div>

                <p id="about-nepa-content">

                    
                    <span className="about-nepa-title">
                        About NEPA
                    </span>


                    <span className="about-nepa-bold">
                        <div id="about-nepa-side-image"></div>
                        Some 50 years ago, a near-unanimous U.S. Congress passed, and President Richard Nixon signed into law, the National Environmental Policy Act of 1969 (NEPA). 
                    </span>

                    <span className="default-style">
                        NEPA is elegant in its vision—that science results in more informed decisions, and that a democratic process that engages the public results in better environmental and social outcomes. The heart of NEPA is the Environmental Impact Statement (EIS), a detailed, scientific analysis of the expected impacts of federal actions (plans, projects, and activities) and an assessment of possible alternative actions. 
                    </span>

                    <span className="about-nepa-subhead">
                        The NEPA Process 
                    </span>

                    <span className="default-style">
                        An EIS provides a systematic process to analyze the expected direct, indirect, and cumulative impacts of a proposed federal action on the environment and on human well-being.
                    </span>


                    <table className="about-nepa-table">
                        <tbody>
                        <tr>
                            <td>
                                1.
                            </td>
                            <td>
                                The EIS process starts when a lead federal agency identifies the purpose and need for a project and publishes a <span className="bold">Notice of Intent</span> (NOI) in the Federal Register (a log of all federal government activities).
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2.
                            </td>
                            <td>
                                The agency then undertakes a <span className="bold">scoping process</span>, inviting input from all interested parties (federal agencies, state and local governments, Native nations, other directly affected parties, and the public) to identify needed scientific studies and to articulate possible alternative actions.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.
                            </td>
                            <td>
                                The agency prepares <span className="bold">a draft EIS</span> documenting potential environmental and socio-economic impacts of the proposed action and alternatives. The draft EIS gives the public and other agencies the opportunity to review and comment on the proposed action, provide additional data to the responsible agency, and suggest adoption of an alternative. The agency must address all substantive comments.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                4.
                            </td>
                            <td>
                                <span className="bold">A final EIS</span> presents the course of action chosen (the original proposed action or an alternative) and the agency’s response to public comments. The process concludes with a <span className="bold">Record of Decision</span> (ROD) explaining the agency’s reasoning for its decision.
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <span className="about-nepa-subhead2">
                        NEPA’s Results
                    </span>
                    <span className="default-style">
                        Since 1970, some 37,000 EISs have analyzed the impacts of federal actions such as construction of transportation infrastructure; permit approvals for oil, gas, and mineral extraction; management of public lands; and proposed regulations. Taken together, these EISs provide a vast store of varied data—hydrological, ecological, social, economic, and cultural, and public health. 
                    </span>
                    <span className="default-style">
                        <Link className="about-nepa-button" to="/aboutnepaccess">NEPAccess</Link> uniquely opens this trove of NEPA documents—heretofore “hidden” from public use—for extended and novel applications in environmental analysis, management, and scientific research.
                    </span>
                    
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </p>
            </div>
        );
    }
}

export default AboutNepa;