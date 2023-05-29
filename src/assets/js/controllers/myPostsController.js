/**
 * Controller voor MyPosts Pagina
 */
import { App } from "../app.js";
import { Controller } from "./controller.js"
import { MyPostsRepository } from "../repositories/myPostsRepository.js";

export class myPostsController extends Controller {
    #myPostsView;
    #myPostsRepository;
    limitperpage;
    
    constructor() {
        super();
        this.#myPostsRepository = new MyPostsRepository();
        this.currentPage = 0; // New instance variable
        this.cachedData = []; // New instance variable
        this.originalData = []; // Correct placement
        this.limitperpage = 3; // Initialize it here
        this.#setupView();
        this.#getStories();
    }

    async #setupView() {
        this.#myPostsView = await super.loadHtmlIntoContent("html_views/myposts.html")
    
        let backarrow = document.querySelector("#firstSvg");
        let nextarrow = document.querySelector("#secondSvg");
        let searchbar = document.querySelector(".searchbar");  // Get the search bar input field
    
        backarrow.addEventListener("click", (event) => this.#pageSelector("back"));
        nextarrow.addEventListener("click", (event) => this.#pageSelector("next"));

        let filtertype = document.querySelector(".type");
        filtertype.addEventListener("click", (event) => this.#sorteerType());

        let filterlikes = document.querySelector(".likes");
        filterlikes.addEventListener("click", (event) => this.#sorteerLikes());
        
        let searchpost = document.querySelector(".searchbar-icon");
        searchpost.addEventListener("click", (event) => this.#searchPost());
    }
    

    async #getStories() {
        let userid = App.sessionManager.get("id");
        const storyData = await this.#myPostsRepository.getStories(userid);
        this.cachedData = storyData; // Save the fetched data into cachedData
        this.originalData = [...storyData]; // Save a copy of the original data

        // Clear the story container
        let container = document.querySelector(".story-container");
        container.innerHTML = "";

        this.#showStories();
        this.#updatePageInfo();  // Update the page info
    }

    #sorteerType() {
        if(this.isSorted == 0) {
            // Sort cachedData by soortBericht
            this.cachedData.sort((a, b) => {
                if (a.soortBericht < b.soortBericht) {
                    return -1;
                }
                if (a.soortBericht > b.soortBericht) {
                    return 1;
                }
                return 0;
            });
    
            this.isSorted = 1;
        } else {
            // reset back to original data if already sorted
            this.cachedData = [...this.originalData];
            this.isSorted = 0;
        }
    
        // Clear the story container
        let container = document.querySelector(".story-container");
        container.innerHTML = "";

        this.#showStories(this.cachedData); // Update the page info
    }

    #sorteerLikes() {
        if(this.isSorted == 0) {
            // Sort cachedData by soortBericht
            this.cachedData.sort((a, b) => {
                if (a.aantalLikes < b.aantalLikes) {
                    return -1;
                }
                if (a.aantalLikes > b.aantalLikes) {
                    return 1;
                }
                return 0;
            });
    
            this.isSorted = 1;
        } else {
            // reset back to original data if already sorted
            this.cachedData = [...this.originalData];
            this.isSorted = 0;
        }
    
        // Clear the story container
        let container = document.querySelector(".story-container");
        container.innerHTML = "";
    
        this.#showStories(this.cachedData); // Update the page info
    }

    #searchPost() {
        let searchvalue = document.querySelector(".searchbar").value;

        if (searchvalue.trim() === '') {
            // If search value is empty, reset cachedData to the original data
            this.cachedData = [...this.originalData];
        } else {
            // Otherwise, filter the originalData
            let filteredData = this.originalData.filter((story) => {
                return story.onderwerp.toLowerCase().includes(searchvalue.toLowerCase());
            });
            this.cachedData = filteredData;
        }

        this.currentPage = 0; // Reset page to the first one

        // Clear the story container
        let container = document.querySelector(".story-container");
        container.innerHTML = "";

        this.#showStories();
        this.#updatePageInfo();  // Update the page info
    }
    

    #showStories() {
        let start = this.currentPage * this.limitperpage;
        let end = start + this.limitperpage;
    
        for (let index = start; index < end && index < this.cachedData.length; index++) {
            let sid = this.cachedData[index].id;
            let stitle = this.cachedData[index].onderwerp;
            let sflow = this.cachedData[index].aantalLikes - this.cachedData[index].aantalDislikes;
            let soort = this.cachedData[index].soortBericht;
            let imagepath = this.cachedData[index].plaatje;
            this.#appendStory(stitle, sflow, sid, soort, imagepath);
        }
    }
    
    

    #pageSelector(whereto){
        let container = document.querySelector(".story-container");
        container.innerHTML = "";
    
        if(whereto == "back" && this.currentPage > 0){
            this.currentPage--;
        } else if(whereto == "next" && (this.currentPage + 1) * this.limitperpage < this.cachedData.length){
            this.currentPage++;
        }
    
        this.#showStories();
        this.#updatePageInfo();  // Add this line
    }

    #updatePageInfo() {
        // Calculate the total number of pages
        let totalPages = Math.ceil(this.cachedData.length / this.limitperpage);
        // Get the p element inside the .page-selector
        let pageInfo = document.querySelector(".page-selector p");
        // Update the text
        pageInfo.textContent = `${this.currentPage + 1} / ${totalPages}`;
    }

    

    #appendStory(stitle, sflow, sid, soort, imagepath) {
        let storygradient = "verhaal-gradient";
        switch(soort) {
            case "bulletin":
                storygradient = "bulletin-gradient"
            break;

            case "instantie":
                storygradient = "instantie-gradient"
            break;
        }

        // Create a new div element with the class "story"
        var storyDiv = document.createElement("div");
        storyDiv.classList.add("story");
        storyDiv.classList.add(storygradient);

        // Create an image element
        var img = document.createElement("img");
        img.src = imagepath;
        img.alt = "";
      
        // Create an h2 element
        var h2 = document.createElement("h2");
        h2.textContent = stitle;
      
        // Create the first icon-holder div
        var iconHolder1 = document.createElement("div");
        iconHolder1.classList.add("icon-holder");
      
        // Create an SVG element
        var svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg1.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg1.setAttribute("fill", "currentColor");
        svg1.classList.add("bi", "bi-chat-text-fill");
        svg1.setAttribute("viewBox", "0 0 16 16");
      
        // Create a path element inside the SVG
        var path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path1.setAttribute("d", "M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z");
      
        // Append the path to the SVG
        svg1.appendChild(path1);
      
        // Create a p element
        var p1 = document.createElement("p");
        p1.textContent = "52";
      
        // Append the SVG and p elements to the first icon-holder div
        iconHolder1.appendChild(svg1);
        iconHolder1.appendChild(p1);
      
        // Create the second icon-holder div
        var iconHolder2 = document.createElement("div");
        iconHolder2.classList.add("icon-holder");
      
        // Create an SVG element
        var svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg2.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg2.setAttribute("fill", "currentColor");
        svg2.classList.add("bi", "bi-graph-up-arrow");
        svg2.setAttribute("viewBox", "0 0 16 16");
      
        // Create a path element inside the SVG
        var path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path2.setAttribute("fill-rule", "evenodd");
        path2.setAttribute("d", "M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z");
      
        // Append the path to the SVG
        svg2.appendChild(path2);
      
        // Create a p element
        var p2 = document.createElement("p");
        p2.setAttribute("id", "trending");
        p2.textContent = sflow;
      
        // Append the SVG and p elements to the second icon-holder div
        iconHolder2.appendChild(svg2);
        iconHolder2.appendChild(p2);
      
        // Append the image, h2, first icon-holder div, and second icon-holder div to the story div
        storyDiv.appendChild(img);
        storyDiv.appendChild(h2);
        storyDiv.appendChild(iconHolder1);
        storyDiv.appendChild(iconHolder2);

        let deleteButton = document.createElement("div");
        deleteButton.classList.add("story-delete");
        let deleteButtonText = document.createElement("p");
        deleteButtonText.textContent = "Delete";

        deleteButton.appendChild(deleteButtonText);

        let editButton = document.createElement("div");
        editButton.classList.add("story-edit");
        let editButtonText = document.createElement("p");
        editButtonText.textContent = "Edit";

        editButton.appendChild(editButtonText);
      
        // Append the story div to the document body
        let targetElement = document.querySelector(".story-container");
        targetElement.appendChild(storyDiv);
        targetElement.appendChild(deleteButton);
        targetElement.appendChild(editButton);

        storyDiv.addEventListener("click", () => {
            window.location.href = "/#read/" + sid;
        })

        deleteButton.addEventListener("click", () => {
            alert("Deleting story post with the id: " + sid);
            this.#myPostsRepository.delete(sid);
            App.loadController(App.CONTROLLER_MYPOSTS);
        });

        editButton.addEventListener("click", () => {
            window.location.href = "/#edit/" + sid;
        });
      }
}