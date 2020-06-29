import React from 'react';
import './aboutNepa.css';

import {Link} from 'react-router-dom';

class AboutNepaccess extends React.Component {
    render() {
        return (
            <div>
                <div id="about-nepaccess-banner"></div>
                
                <div id="about-nepa-content">
                
                    <span className="about-nepa-title">
                        About NEPAccess
                    </span>

                    <span className="default-style bold">
                        NEPAccess helps bring <Link className="about-nepa-button" to="/aboutnepa">NEPA</Link> into the 21st century by harnessing the power of data science to enable the full vision of NEPA as a strategy to deal with emerging 21st-century social, economic, and environmental challenges.
                    </span>
                    <span className="default-style">
                        NEPAccess is housed at the University of Arizona and is supported by <a id="link-award" href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=1831551">a research grant from the National Science Foundation (no. 1831551, Dr. Laura López-Hoffman, PI)</a>, with additional resources from the University of Arizona and the Morris K. Udall and Stewart L. Udall Foundation.
                    </span>
                    <span className="default-style">
                        The NEPAccess team is interdisciplinary (principally based at UArizona, with one member from the University of California, Davis) and comprises researchers from data science, natural language processing (NLP), public administration, political science, law, natural resources policy, and UX design and outreach.
                    </span>
                    <span className="default-style">
                        NEPAccess is a knowledge catalyst and decision-making platform that provides access to thousands of NEPA documents and makes available for the first-time analytical tools that enable systematic research by scholars in the social and natural sciences, law, and public health, and application by NEPA practitioners, project proponents, and a range of stakeholders.
                    </span>
                    <span className="default-style">
                        Using cutting-edge NLP and other analytic tools, scholars, citizens, environmental professionals, and agency staff can use NEPAccess to answer a host of critical questions about how humans impact the environment and how the environment impacts us.
                    </span>

                    <div className="inline-block">

                        <span className="about-nepaccess-contact-header">
                            For more information about NEPAcces contact:
                        </span>
                        <span className="about-nepaccess-contact-content">
                            Jonathan Derbridge,
                        </span>
                        <span className="about-nepaccess-contact-content">
                            NEPAccess Project Manager
                        </span>
                        <span className="about-nepaccess-contact-content">
                            <a className="about-nepa-button email-text">derbridge@arizona.edu</a>
                        </span>
                        <br />
                        <br />
                        
                    </div>

                    <div id="about-nepaccess-nsf-logo"></div>
                    <div id="about-nepaccess-ua-logo"></div>

                    <div className="about-personnel">
                        <span className="personnel-header">
                            Team Personnel
                        </span>


                        <label className="about-block">
                            <span className="italic-header">
                                Principal Investigator
                            </span>
                            <span className="about-name">
                            Laura López-Hoffman
                            </span>
                            <span className="about">
                            , Professor, School of Natural Resources and the Environment, and Research Professor, Udall Center for Studies in Public Policy
                            </span>
                        </label>


                        <label className="about-block">
                            <span className="italic-header">
                                Co-Principal Investigators
                            </span>
                            <label className="block">
                                <span className="about-name">
                                    Elizabeth Baldwin
                                </span>
                                <span className="about">
                                    , Assistant Professor, School of Government and Public Policy
                                </span>
                            </label>
                            <label className="block">
                                <span className="about-name">
                                    Steven Bethard
                                </span>
                                <span className="about">
                                    , Associate Professor, School of Information
                                </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Marc Miller</span>
                            <span className="about">
                                , Dean &amp; Ralph W. Bilby Professor, James E. Rogers College of Law
                            </span>
                            </label>

                            <label className="block">
                            <span className="about-name">Sudha Ram</span>
                            <span className="about">
                                , Anheuser-Busch Endowed Professor of MIS, Entrepreneurship &amp; Innovation, and Professor of Computer Science
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Tyler Scott</span>
                            <span className="about">
                                , Assistant Professor, Environmental Science and Policy, University of California Davis
                            </span>
                            </label>
                        </label>


                        <label className="about-block">
                            <span className="italic-header">Senior Personnel
                            </span>

                            <label className="block">
                            <span className="about-name">Faiz Currim</span><span className="about">
                                , Senior Lecturer, Management Information Systems
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Jonathan Derbridge</span><span className="about">
                                , Research Director, López-Hoffman Lab
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Kirk Emerson</span><span className="about">
                                , Professor of Practice, School of Government and Public Policy
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Egoitz Laparra</span><span className="about">
                                , Postdoctoral Research Associate, School of Information
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Aaron Lien</span><span className="about">
                                , Assistant Professor, Rangeland Ecology and Adaptive Management
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Robert Merideth</span><span className="about">
                                , Senior Researcher, López-Hoffman Lab, and Editor in Chief (ret.), Udall Center for Studies in Public Policy
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Justin Pidot</span><span className="about">
                                , Professor of Law, and Co-Director of the Environmental Studies Program, James E. Rogers College of Law
                            </span>
                            </label>
                        </label>


                        <label className="about-block">
                            <span className="italic-header">Other Personnel
                            </span>
                            <label className="block">
                            <span className="about-name">Alex Binford-Walsh</span><span className="about">
                                , Supervisor, Undergraduate Student Researchers, and Undergraduate Student, Natural Resources
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">John Caleb Jackson</span><span className="about">
                                , Media Specialist, James E. Rogers College of Law
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Paul Mirocha</span><span className="about">
                                , User Experience Designer, Udall Center for Studies of Public Policy, and Desert Laboratory on Tumamoc Hill
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Maya R. Stahl</span><span className="about">
                                , Freelance Artist
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Josh Vinal</span><span className="about">
                                , Full-stack Developer, MIS, Eller College of Management
                            </span>
                            </label>
                        </label>


                        <label className="about-block">
                            <span className="italic-header">Graduate Student Researchers
                            </span>
                            <label className="block">
                            <span className="about-name">Xiaoxiao Chen</span><span className="about">
                                , Doctoral Student, School of Information
                            </span>
                            </label>

                            <label className="block">
                            <span className="about-name">Buomsoo Kim</span><span className="about">
                                , Doctoral Student, MIS, Eller College of Management
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Kyuhan Lee</span>

                            <span className="about">
                                , Doctoral Student, INSITE Center, MIS, Eller College of Management
                                </span>
                            </label>
                        </label>






                        <label className="about-block">
                            <span className="italic-header">Undergraduate Student Researchers
                            </span>
                            <label className="block">
                            <span className="about-name">John Guthrie</span><span className="about">
                                , Undergraduate Student, Natural Resources
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Samantha Johnson</span><span className="about">
                                , Undergraduate Student, Natural Resources and Veterinary Science
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Natasha Lofgreen</span><span className="about">
                                , Undergraduate Student, Natural Resources
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Amber Petrie</span><span className="about">
                                , Undergraduate Student, Geosciences, Marine Science, and Natural Resources
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Ashley Stava</span><span className="about">
                                , Undergraduate Student, Marine Science and Natural Resources
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Britney Swiniuch</span><span className="about">
                                , Undergraduate Student, Marine Science and Natural Resources
                            </span>
                            </label>
                            <label className="block">
                            <span className="about-name">Daniel Velasco</span><span className="about">
                                , Undergraduate Student, Anthropology and Natural Resources
                            </span>
                            </label>
                        </label>
                    </div>

                </div>

            </div>
        );
    }
}

export default AboutNepaccess;