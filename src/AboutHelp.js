import React from 'react';
import './aboutNepa.css';

export default class AboutHelp extends React.Component {
    
    render () {
        return (
            <div>
                <div className="spacer"> </div>

                <div id="about-nepa-content">

                    <h1 className="about-nepa-title">
                        How to use NEPAccess
                    </h1>
                    
                    <span className="about-nepa-bold">
                        You can search for terms in the title (default search), or in the documents (full-text search).  Search behavior is "all-word," meaning results will only be returned if all words in the search terms are found.
                    </span>
                    <span className="about-nepa-bold">
                        The fulltext search is powered by Apache Lucene, which allows the use of term modifiers like "" to find exact phrases, wildcards like * and ?, and more ( 
                         <a className="about-nepa-button underline" href="https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Term Modifiers">described here</a>
                        ).  
                        <p>Proximity matching, for example, is done by surrounding terms in double quotes and appending ~#, where # is the maximum number of words that may appear between them.
                        </p>
                    </span>
                    <span className="default-style">
                        The current data uses a list of "stopwords" which are extremely common words that aren't indexed. They will be ignored, and therefore won't influence search results.
                        These search terms are:
                        <p>"a", "an", "and", "are", "as", "at", "be", "but", "by",</p>
                        <p>"for", "if", "in", "into", "is", "it",</p>
                        <p>"no", "not", "of", "on", "or", "such",</p>
                        <p>"that", "the", "their", "then", "there", "these",</p>
                        <p>"they", "this", "to", "was", "will", "with"</p>
                    </span>
                    
                    <h3>
                        Metadata
                    </h3>
                    
                    <span className="default-style">
                        The data currently in the system includes metadata like titles, dates, lead agencies, states, and document types (draft EIS/final EIS/...).
                    </span>
                    
                    <h3>
                        Files and Full Texts
                    </h3>
                    
                    <span className="default-style">
                        The source files are sometimes available for both download and full-text search.  Because the source PDFs are often split into multiple files, the available downloads are for the archives containing one or more PDFs.
                    </span>
                    <span className="default-style">
                        The full-text search comes from the PDFs being converted to plaintext which is then stored in the database and indexed by Lucene, while maintaining their relationship to the metadata.
                    </span>


                </div>
            </div>
        );
    }
}