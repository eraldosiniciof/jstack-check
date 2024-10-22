document.querySelector("#activateButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        if (!window.location.href.includes("jstack")) {
          alert("Você não está no site do JStack");
          return;
        }
        let checkedListStorage =
          JSON.parse(localStorage.getItem("@stack-checked")) || [];

        const listClass = document.querySelectorAll(
          "#root > div > main > div.container.px-5.pb-12.pt-10.md\\:px-8 > div.mt-6.grid.grid-cols-1.gap-x-6.gap-y-10.sm\\:grid-cols-2.md\\:grid-cols-3 > a > div > div.space-y-1\\.5 > strong"
        );

        listClass.forEach((item) => {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.setAttribute("class", "check");

          const titleClass = item.textContent;
          if (checkedListStorage.includes(titleClass)) {
            checkbox.checked = true;
            item.style.textDecoration = "line-through";
            item.style.color = "gray";
            const imageElement =
              item.parentElement.parentElement.querySelector("img");
            if (imageElement) {
              imageElement.style.filter = "blur(5px)";
            }
          }

          item.prepend(checkbox);
        });

        const checkBoxes = document.querySelectorAll(".check");
        const checkList = [...checkedListStorage];

        checkBoxes.forEach((checkbox) => {
          checkbox.addEventListener("change", (event) => {
            const titleElement = event.target.parentElement;
            const titleClass = titleElement.textContent;
            const checked = event.target.checked;
            const imageElement =
              titleElement.parentElement.parentElement.querySelector("img");

            if (checked && !checkList.includes(titleClass)) {
              checkList.push(titleClass);
              titleElement.style.textDecoration = "line-through";
              titleElement.style.color = "gray";
              if (imageElement) {
                imageElement.style.filter = "blur(5px)";
              }
            } else if (!checked) {
              const index = checkList.indexOf(titleClass);
              if (index > -1) {
                checkList.splice(index, 1);
              }
              titleElement.style.textDecoration = "none";
              titleElement.style.color = "";
              if (imageElement) {
                imageElement.style.filter = "none";
              }
            }

            localStorage.setItem("@stack-checked", JSON.stringify(checkList));
          });
        });
      },
    });
  });
});
