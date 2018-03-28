import React from 'react';

import './../styles/Search.css';

const Search = ({ onChange }) => (
    <div className="searchContainer">

        <input
            id="searchInput"
            type="text"
            onChange={onChange}
            placeholder="Wpisz słowo kluczowe..." />
    </div>
);

export default Search;
