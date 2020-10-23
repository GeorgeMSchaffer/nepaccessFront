import React from 'react';
import './aboutNepa.css';
import './aboutHelp.css';

export default class AboutHelpMore extends React.Component {
    
    render () {
        return (
            <div>
                <div className="spacer"> </div>

                <div id="about-nepa-content">

                    <h1 className="about-nepa-title">
                        What the database contains
                    </h1>
                    
                    <h2>
                        Environmental Impact Statements
                    </h2>
                    
                    <div>
                        NEPAccess contains all records from environmental impact statements (EIS) created between  1987-2018. There are downloadable PDF files for EIS’s from 2012-2018. 
                    </div>
                    
                    <div><p>
                        This includes draft and final documents. NEPA access is a work in progress—as time goes on, other documents related to the National Environmental Policy Act of 1969 (NEPA) will be added.
                    </p></div>

                    <h2>
                        Downloadable Files
                    </h2>

                    <div>
                        In most cases, there is a downloadable PDF file available. Because EISs are often split into multiple files, the downloaded archive may contain more than one PDF.
                    </div>

                </div>
            </div>
        );
    }
}