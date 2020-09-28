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
                        You can search for terms in the title or in the documents.  Search behavior is "all-word," meaning results will only be returned if all words in the search terms are found.
                    </span>
                    <span className="about-nepa-bold">
                        The fulltext search is powered by Apache Lucene, which allows the use of parentheses, AND/OR/NOT, the * wildcard, and more ( 
                         <a className="about-nepa-button underline" href="https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Term Modifiers">described here</a>
                        ).
                    </span>
                    
                    <h3>Boolean queries explained</h3>
                    <p>
                        AND is implicit.  The term modifier is prepending with AND or + but this is unnecessary.
                    </p><p>
                        OR is OR, || or |.
                    </p><p>
                        NOT is NOT or -.
                    </p><p>
                        Exact phrases are surrounded by double quotes.
                    </p>
                    <h3>
                        Examples:
                    </h3>
                    <p>
                        Searching "operation funding" "yonkers westchester" will return records containing both those phrases.  This is the same as searching +"operation funding" +"yonkers westchester".
                    </p><p>
                        Searching operation funding yonkers westchester (unquoted) will return records containing all those terms in any order.
                    </p><p>
                        Searching ("wildlife refuge") || ("construction operation") will return all results which have at least one of those phrases.
                    </p><p>
                        Searching "wildlife refuge" -"construction operation" will return all results which have the phrase "wildlife refuge" but not the phrase "construction operation".
                    </p><p>
                        Multiple boolean operators can be combined for more complex queries.  Terms can be surrounded by parentheses to ensure both the order of operations and the differentiation of term modifiers.  Lowercase and/or/not will be ignored because they are stopwords.
                    </p><p>
                        Here's an example including multiple operators, proximity matching and parentheses: (wildlife OR habitat) AND ("construction maintenance"~10)
                    </p>
                    
                    <span className="default-style">
                        <span className="about-nepa-bold">
                            The current data uses a list of "stopwords" which are extremely common words that aren't indexed. They will be ignored, and therefore won't influence search results.  Punctuation is also ignored if not recognized as term modifiers.
                            Ignored search terms are:
                        </span>
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
                        The source files are sometimes available for both download and full-text search.  Because the source PDFs are often split into multiple files, the available downloads are for the archives containing one or more PDFs, but the results returned are per file and listed by filename (if files are available).
                    </span>

                </div>
            </div>
        );
    }
}