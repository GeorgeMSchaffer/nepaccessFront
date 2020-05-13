import React from 'react';
import './aboutNepa.css';

import {Link} from 'react-router-dom';

class AboutNepaccess extends React.Component {
    render() {
        return (
            <div>
                <div id="about-nepaccess-banner"></div>
                
                <p id="about-nepa-content">
                
                    <span className="about-nepa-title">
                        About NEPAccess
                    </span>

                    <span className="default-style bold">
                        <div id="about-nepaccess-side-image"></div>
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
                        <Link className="about-nepa-button">derbridge@arizona.edu</Link>
                    </span>
                    
                    <span className="default-style"></span>

                </p>

            </div>
        );
    }
}

export default AboutNepaccess;