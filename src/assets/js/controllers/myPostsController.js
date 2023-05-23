/**
 * Controller voor MyPosts Pagina
 */
import { App } from "../app.js";
import { Controller } from "./controller.js"
import { MyPostsRepository } from "../repositories/myPostsRepository.js";

export class myPostsController extends Controller {
    #myPostsView;
    #myPostsRepository;
    
    constructor() {
        super();
        this.#myPostsRepository = new MyPostsRepository();
        this.#setupView();
        this.#getStories();

    }

    async #setupView() {
        this.#myPostsView = await super.loadHtmlIntoContent("html_views/myposts.html")
    }

    async #getStories(){
        let userid = App.sessionManager.get("id");
        const storyData = await this.#myPostsRepository.getStories(userid);

        // Clear the story container
        let container = document.querySelector(".story-container");
        container.innerHTML = "";

        storyData.forEach(story => {
            let sid = story.id;
            let stitle = story.onderwerp;
            let sflow = story.aantalLikes - story.aantalDislikes;
            this.#appendStory(stitle, sflow, sid);
        });
    }

    #appendStory(stitle, sflow, sid) {
        // Create a new div element with the class "story"
        var storyDiv = document.createElement("div");
        storyDiv.classList.add("story");

        // Create an image element
        var img = document.createElement("img");
        img.src = "assets/img/guus.jpg";
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

        deleteButton.addEventListener("click", () => {
            alert("Deleting story post with the id: " + sid);
            this.#myPostsRepository.delete(sid);
            App.loadController(App.CONTROLLER_MYPOSTS);
        });

        editButton.addEventListener("click", () => {
            alert("Editing story post with the id: " + sid);
        });
      }
}