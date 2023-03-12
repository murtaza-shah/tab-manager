window.addEventListener("DOMContentLoaded", function(){
    const listHolder = document.getElementById("duplicates");
    let duplicateUrls = [];
    let checked = new Set();

    chrome.runtime.sendMessage({type: "getTabs"}, function(response){
        console.log(response);
        for(let i=0; i<response.length; i++){
            let j = i+1;
            let copies = [];
            while(j < response.length){
                if(response[i].url == response[j].url && !checked.has(response[i].id)){
                    checked.add(response[i].id);
                    copies.push(response[j]);
                    // discard the tab so even if it's not removed, it's not taking up memory
                    if(response[j].active){
                        chrome.tabs.discard(response[j].id);
                    }
                }
                j++;
            }
            copies.forEach(c => {
                duplicateUrls.push({title: c.title, id: c.id});
            })
        }
        console.log(duplicateUrls);
        for(let i=0; i<duplicateUrls.length; i++){
            let li = document.createElement("li");
            li.innerHTML = duplicateUrls[i].title;
            li.addEventListener("click", function(){
                chrome.tabs.remove(duplicateUrls[i].id);
                li.remove();
            });
            listHolder.appendChild(li);
        }
    });
});
