import React from 'react';
import './aboutNepa.css';
import './aboutHelp.css';

export default class AboutHelp extends React.Component {
    
    render () {
        return (
            <div>
                <div className="spacer"> </div>

                <div id="about-nepa-content">

                    <h1 className="about-nepa-title">
                        How to use NEPAccess
                    </h1>
                    
                    <h2>
                        What the database contains
                    </h2>
                    
                    <div>
                        <span>
                            
                        <span className="bold">
                            Environmental Impact Statements. </span>
                            NEPAccess has all EIS records from 1987-2018, and associated PDF files for EIS’s from 2012-2018. NEPA access can search for any “environmental impact statement, or EIS, created between 2008 and 2017. This includes draft and final documents. NEPA access is a work in progress—as time goes on, other documents related to the National Environmental Policy Act of 1969 (NEPA) will be added.
                        </span>
                    </div>

                    <br></br>

                    <div>
                        <span className="bold">
                            Downloadable Files. </span>

                        <span>
                            In most cases, there is a downloadable PDF file available. Because EISs are often split into multiple files, the downloaded archive may contain more than one PDF.
                        </span>
                    </div>
                    
                    <h2>
                        How to make advanced search queries
                    </h2>

                    <span>
                        Punctuation is ignored except when used as search-term modifiers as shown below.
                    </span>

                    <br></br>
                    <br></br>

                    <span className="bold">
                        Search-Term Modifiers
                    </span>

                    <table className="help-table">
                        <tbody>
                            <tr>
                                <td>Modifier</td>
                                <td>What it does</td>
                                <td>Example</td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="color">
                                        "
                                    </span>
                                    keyword
                                    <span className="color">
                                        "
                                    </span>
                                </td>
                                <td>
                                    A keyword in quotes forces an exact-match search. Words or phrases placed within quotes retrieve only that exact phrase.
                                </td>
                                <td>
                                    <span className="color">
                                        "Landscape restoration" </span>
                                    will only return documents containing <span className="bold">
                                        both these words, in that order.
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="color">
                                        AND </span>
                                    or <span className="color">
                                        +
                                    </span>
                                </td>
                                <td>
                                    Search for X and Y. This will return only results related to both X and Y.
                                </td>
                                <td>
                                    <span className="color">
                                        Recreation AND culture </span>
                                    will only return documents related to <span className="bold">both</span> of these words.
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="color">NOT</span>, or <span className="color">-</span></td>
                                <td>Exclude a word or phrase.</td>
                                <td>
                                    <span className="color">Mining -copper</span> will return all results including the term <span className="color">mining</span> but <span className="bold">not</span> the term <span className="color">copper</span>.
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="color">*</span>
                                </td>
                                <td>
                                    The * symbol placed after a word is a <span className="bold">multi-character wild card</span>—it will retrieve all words or phrases that start with that word.
                                </td>
                                <td>
                                    <span className="color">Land*</span> will return <span className="color">landscape, landlord, landfill, landmark, land bridge</span>, etc. <span className="color">L*nd</span> will return <span className="color">land</span>, <span className="color">legend</span>, and placenames like <span className="color">Lakeland</span>.
                                </td>
                            </tr>
                            <tr>
                                <td className="color">?</td>
                                <td>The ? symbol placed after a word is a <span className="bold">single-character wild card</span>—it looks for terms that match that with the single character replaced.</td>
                                <td>Searching for <span className="color">te?t</span> would return "text" and “test, and <span className="color">tes?</span> Will return <span className="color">test</span>, and acronyms like <span className="color">TESP</span> (Threatened, Endangered, and Sensitive Plants).</td>
                            </tr>
                            <tr>
                                <td><span className="color">OR,</span> <span className="color">|</span> or <span className="color">||</span></td>
                                <td>This will return results related to either search term or to both.</td>
                                <td className="color">highways OR viaducts, highways | viaducts,  highways || viaducts </td>
                            </tr>
                            <tr>
                                <td className="color">~</td>
                                <td>Use the tilde, ~, symbol at the end of a phrase to do a <span className="bold">proximity search</span>, finding words that are a within a specific distance from each other in the text.</td>
                                <td>For example, to search for a <span className="color">mine</span> and <span className="color">Tribe</span> within 20 words of each other in a document use the search-term: <span className="color">"mine Tribe"~20</span></td>
                            </tr>
                            <tr>
                                <td>Combine  multiple operations for more complex queries.</td>
                                <td>Use parentheses to specify the order of operations and scope of the modifiers. </td>
                                <td>This search-term modifier combines the AND Boolean operator with proximity search:  
                                    <div className="color">("copper mining" ~10) AND ("desert tortoise" OR "desert toad")</div>
                                    retrieves documents where copper and mining appear <span className="bold">within 10 words of each other</span>. It further restricts the results to <span className="bold">only show documents containing</span> either desert tortoise <span className="bold">or</span> desert toad.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    
                    See <a className="about-nepa-button underline" href="https://lucene.apache.org/core/2_9_4/queryparsersyntax.html#Term Modifiers">Apache Lucene Query Syntax</a> for more details.

                    <div>

                        <br></br>

                        <h3 className="help-header">Words that are ignored</h3>

                        <br></br>
                        <br></br>

                        <span className="default-style">
                            The current database uses a list of "stopwords" which are extremely common words that aren't indexed. They will be ignored, and therefore won't influence search results. Ignored search terms are:
                        </span>
                    </div>

                    <div className="background-gray">
                        <p>a, an, and, are, as, at, be, but, by,</p>
                        <p>for, if, in, into, is, it,</p>
                        <p>no, not, of, on, or, such,</p>
                        <p>that, the, their, then, there, these,</p>
                        <p>they, this, to, was, will, with</p>
                    </div>
                    
                    <br></br>

                    <span>For example, the search query, “to be or not to be” will not return any results.</span>
                    
                    <br></br>
                    
                    <br></br>
                    
                    <br></br>
                    
                    <h3 className="help-header">
                        Simple Search
                    </h3>
                    
                    <span className="default-style">
                        The default search box searches within titles. It finds documents that have "All of these words," meaning results will only be returned if all words entered in the search box are found within the title. This can sometimes give no results. Other times it can give too many results, in which case a good option is to use the advanced search and select "Any of these words."
                    </span>
                    
                    <br></br>

                    <h3 className="help-header">
                        Advanced Search
                    </h3>

                    <span className="default-style">
                        Advanced search narrows a search using metadata like
                    </span>
                    <div className="bullets">
                        <p>
                            &bull; <span>a date range.</span>
                        </p>
                        <p>
                            &bull; <span>lead agencies.</span>
                        </p>
                        <p>
                            &bull; <span>states.</span>
                        </p>
                        <p>
                            &bull; <span>document type (draft or final).</span>
                        </p>
                        <p>
                            &bull; <span>(More to be added)</span>
                        </p>
                    </div>
                    
                    <br></br>
                    
                    <br></br>
                    
                    <h3 className="help-header">
                        Full-Text Search
                    </h3>
                    <span className="default-style">
                        The full-text search (powered by Apache Lucene) looks for words within the full body of the document. You can toggle on and off the option to show your search terms in bold in context of a snippet of body text.
                    </span>
                </div>
            </div>
        );
    }
}