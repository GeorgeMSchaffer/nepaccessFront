import React from 'react';
import './aboutNepa.css';
import './aboutHelp.css';

export default class AboutSearchTips extends React.Component {
    
    render () {
        return (
            <div>
                <div className="spacer"> </div>

                <div id="about-nepa-content">

                    <h1 className="about-nepa-title">
                        Search tips
                    </h1>
                    
                    <h2>
                        A smart search box
                    </h2>
                    
                    <div>
                        By default, the unified search box (powered by Apache Lucene) looks for your search words both within the title, metadata, and the full body of the document. You can also check an option at the search box to search only within the title text. 
                    </div>

                    <h2>
                        Text snippets
                    </h2>

                    <div>
                        You can toggle on and off the option to show your search terms in bold in context of a snippet of body text.
                    </div>
                    
                    <br></br>
                    
                    <h2>
                        How to make advanced search queries
                    </h2>

                    <br></br>

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

                    <p>However, AND, NOT, and OR ( all caps) are read as search term modifiers.</p>
                    
                    <br></br>

                </div>
            </div>
        );
    }
}