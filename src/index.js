import './style.css';
import createApp from './dom.js';
import embedLocalStorage from './data.js';
import test from './data.js';
import { hNav, vNav, container, modal } from './selector.js';

'use strict';

vNav.inbox.onclick = function(){
    console.log(1)
}

hNav.formSearch.onsubmit = function(e){
    e.preventDefault();
    hNav.search.blur();
    console.log(2);
}