if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        var head = document.querySelector('head');  
        var link = document.createElement('link'); 
        link.rel = 'stylesheet';  
        link.type = 'text/css'; 
        link.href = 'dark_style.css';  
        head.appendChild(link);  
}