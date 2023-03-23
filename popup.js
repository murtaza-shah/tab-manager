window.addEventListener("DOMContentLoaded", function () {
  const listHolder = document.getElementById("duplicates");
  const vacuumBtn = document.getElementById("vacuum");
  let duplicateUrls = [];
  let checked = new Set();

  chrome.runtime.sendMessage({ type: "getTabs" }, function (response) {
    for (let i = 0; i < response.length; i++) {
      let j = i + 1;
      let copies = [];
      while (j < response.length) {
        if (
          response[i].url == response[j].url &&
          !checked.has(response[i].id)
        ) {
          checked.add(response[i].id);
          copies.push(response[j]);
          // discard the tab so even if it's not removed, it's not taking up memory

          if (response[j].active) {
            chrome.tabs.discard(response[j].id);
          }
        }
        j++;
      }
      if (copies.length > 0) {
        vacuumBtn.style.display = "block";
        vacuumBtn.addEventListener("click", function () {
          copies.forEach((c) => {
            chrome.tabs.remove(c.id);
          });
          listHolder.innerHTML = "";
          vacuumBtn.style.display = "none";
        });
        sendNotification(copies);
      }
      copies.forEach((c) => {
        duplicateUrls.push({ title: c.title, id: c.id });
      });
    }

    for (let i = 0; i < duplicateUrls.length; i++) {
      let li = document.createElement("li");
      li.innerHTML = duplicateUrls[i].title;
      li.addEventListener("click", function () {
        chrome.tabs.remove(duplicateUrls[i].id);
        li.remove();
        if (duplicateUrls.length === 1) {
          vacuumBtn.style.display = "none";
        }
      });
      listHolder.appendChild(li);
    }
  });
});

function sendNotification(duplicateArray) {
  if (duplicateArray.length > 0) {
    chrome.runtime.sendMessage("", {
      type: "notification",
      options: {
        type: "basic",
        iconUrl: "./icon.png",
        title: "Duplicate Tab",
        message: "Duplicate tabs are open!",
      },
    });
  }
}
