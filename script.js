let posts = [];
let editingPostId = null; 

const postForm = document.getElementById("post-form");
const postTitleInput = document.getElementById("post-title");
const postContentInput = document.getElementById("post-content");
const titleError = document.getElementById("title-error");
const contentError = document.getElementById("content-error");
const postsContainer = document.getElementById("posts-container");

function renderPosts() {
    postsContainer.innerHTML = "";

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        const postDiv = document.createElement("div");
        postDiv.className = "post";

        const postTitle = document.createElement("h3");
        postTitle.textContent = post.title;

        const postContent = document.createElement("p");
        postContent.textContent = post.content;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.setAttribute("data-id", post.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-id", post.id);

        postDiv.appendChild(postTitle);
        postDiv.appendChild(postContent);
        postDiv.appendChild(editButton);
        postDiv.appendChild(deleteButton);

        postsContainer.appendChild(postDiv);
    }
}

function loadPosts() {
    const savedPosts = localStorage.getItem("blogPosts");

    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    } else {
        posts = [];
    }

    renderPosts();
}

postForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();

    titleError.textContent = "";
    contentError.textContent = "";

    let hasError = false;

    if (title === "") {
        titleError.textContent = "Title is required";
        hasError = true;
    }

    if (content === "") {
        contentError.textContent = "Content is required";
        hasError = true;
    }

    if (hasError) {
        return;
    }

    if (editingPostId) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === editingPostId) {
                posts[i].title = title;
                posts[i].content = content;
                break;
            }
        }

        editingPostId = null; 
    } else {
        const postId = Date.now().toString();

        const newPost = {
            id: postId,
            title: title,
            content: content
        };

        posts.push(newPost);
    }

    localStorage.setItem("blogPosts", JSON.stringify(posts));
    renderPosts();

    postTitleInput.value = "";
    postContentInput.value = "";
});

postsContainer.addEventListener("click", function (event) {
    if (
        event.target.tagName === "BUTTON" &&
        event.target.textContent === "Delete"
    ) {
        const postId = event.target.getAttribute("data-id");

        posts = posts.filter(function (post) {
            return post.id !== postId;
        });

        localStorage.setItem("blogPosts", JSON.stringify(posts));
        renderPosts();
    }

    if (
        event.target.tagName === "BUTTON" &&
        event.target.textContent === "Edit"
    ) {
        const postId = event.target.getAttribute("data-id");

        const postToEdit = posts.find(function (post) {
            return post.id === postId;
        });

        if (postToEdit) {
            postTitleInput.value = postToEdit.title;
            postContentInput.value = postToEdit.content;
            editingPostId = postId;
        }
    }
});

loadPosts();