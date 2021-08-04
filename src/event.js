import { hNav, vNav, container, task, modal } from './selector.js';

'use strict';

const element = (() => {
    let firstFocusableElement;
    let lastFocusableElement;
    let modalToggler;
    return { 
        firstFocusableElement, 
        lastFocusableElement,
        modalToggler
    };
})();

const tabEvent = (e) => {
    let isTabPressed = e.key === 'Tab';

    if (!isTabPressed) { return; }

    if (e.shiftKey) {
        if (document.activeElement === element.firstFocusableElement) {
            element.lastFocusableElement.focus();
            e.preventDefault();
            }
    } else {
        if (document.activeElement === element.lastFocusableElement) {
            element.firstFocusableElement.focus();
            e.preventDefault();
        }
    } 
};

const trapFocus = (modal, toggler) => {
    const focusableElements = 
        modal.querySelectorAll('button, input, select, [tabindex]:not([tabindex="-1"])');
    element.firstFocusableElement = focusableElements[0];
    element.lastFocusableElement = focusableElements[focusableElements.length-1];
    element.modalToggler = toggler;
    
    if((window.innerWidth <= 750) && vNav.nav.contains(element.modalToggler)) {
        vNav.nav.classList.remove('show-nav');
    }

    document.addEventListener('keydown', tabEvent);
    element.firstFocusableElement.focus(); 
};

const removeTrapFocus = () => {
    document.removeEventListener('keydown', tabEvent);
    if((window.innerWidth <= 750) && vNav.nav.contains(element.modalToggler)) {
        vNav.nav.classList.add('show-nav');
        vNav.projects.focus();
    }
    element.modalToggler.focus();
};

const toggle = (() => {
    const menu = (e) => {
        if(window.innerWidth > 750){
            if(vNav.nav.hasAttribute('style')) 
            { vNav.nav.removeAttribute('style'); }
            else { vNav.nav.style.display = 'none'; }
        } else { 
            vNav.nav.classList.toggle('show-nav'); 
        }
        e.stopPropagation();
    };

    const quickAddTask = () => {
        modal.quickAddTask.classList.toggle('on');
        if(modal.quickAddTask.classList.contains('on')) {
            modal.quickAddTaskInput.value = '';
            trapFocus(modal.quickAddContainer, hNav.plus);
        } else {
            removeTrapFocus();
        }
    };

    const notification = () => {
        modal.notification.classList.toggle('on');
        if(modal.notification.classList.contains('on')) {
            trapFocus(modal.notifContainer, hNav.notification);
        } else {
            removeTrapFocus();
        }
    };

    const projects = () => {
        vNav.projectListContainer.classList.toggle('show');
        vNav.projectChevron.classList.toggle('rotate');
    };

    const addProject = (e) => {
        e.stopImmediatePropagation();
        modal.projectCreator.classList.toggle('on');
        
        if(modal.projectCreator.classList.contains('on')){
            modal.newProjectName.value = '';
            trapFocus(modal.projectCreator, vNav.addProject);
        } else {
            vNav.projects.focus();
            removeTrapFocus();
        }
    };

    const labels = () => {
        vNav.labelListContainer.classList.toggle('show');
        vNav.labelChevron.classList.toggle('rotate');
    };

    const addLabel = (e) => {
        e.stopImmediatePropagation();
        modal.labelCreator.classList.toggle('on');

        if(modal.labelCreator.classList.contains('on')){
            modal.addLabelInput.value = '';
            trapFocus(modal.labelCreator, vNav.addLabel);
        } else {
            vNav.labels.focus();
            removeTrapFocus();
        }
    };

    return {
        menu,
        quickAddTask,
        notification,
        projects, addProject,
        labels, addLabel
    };
})();

const clicker = (e) => {
    if(e.key === 'Enter' && e.target.classList.contains('ic-div')){
        e.target.click();
    }
};

const mobileManager = (e) => {
    if (vNav.nav.classList.contains('show-nav') && (window.innerWidth <= 750)){
        if(!vNav.nav.contains(document.activeElement)) { 
            vNav.nav.classList.toggle('show-nav'); 
        }
    }
};

const viewportListener = () => {
    vNav.nav.hasAttribute('style')
        ? vNav.nav.removeAttribute('style') : vNav.nav.classList.remove('show-nav');
};


const event = (() => {
    hNav.menu.addEventListener('click', toggle.menu);

    hNav.plus.addEventListener('click', toggle.quickAddTask);
    modal.quickAddTaskCancel.addEventListener('click',  toggle.quickAddTask);

    hNav.notification.addEventListener('click', toggle.notification);
    modal.notifReadAll.addEventListener('click', toggle.notification);

    vNav.projects.addEventListener('click', toggle.projects);
    vNav.projects.addEventListener('keyup', clicker);
    vNav.addProject.addEventListener('click', toggle.addProject);
    modal.cancelProjectCreator.addEventListener('click', toggle.addProject);

    vNav.labels.addEventListener('click', toggle.labels);
    vNav.labels.addEventListener('keyup', clicker);
    vNav.addLabel.addEventListener('click', toggle.addLabel);
    modal.cancelLabelCreator.addEventListener('click', toggle.addLabel);

    //delete dummy element and event below
    document.querySelector('#dummy').addEventListener('click', function(){
        if (vNav.nav.classList.contains('show-nav')) { return; }

        console.log('shit')
    });

    window.onclick = mobileManager;
    window.onresize = viewportListener;

})();

export default event;