const POST_API = "http://localhost:3000/posts";
const COMMENT_API = "http://localhost:3000/comments";

/* ================= POST ================= */

async function GetPosts() {
    let res = await fetch(POST_API);
    let posts = await res.json();

    let tbody = document.getElementById("post-body");
    tbody.innerHTML = "";

    posts.forEach(p => {
        let cls = p.isDeleted ? "deleted" : "";

        tbody.innerHTML += `
        <tr class="${cls}">
            <td>${p.id}</td>
            <td>${p.title}</td>
            <td>${p.views}</td>
            <td>
                ${p.isDeleted
                ? `<button onclick="RestorePost('${p.id}')">Restore</button>`
                : `<button onclick="SoftDeletePost('${p.id}')">Delete</button>`
            }
            </td>
        </tr>`;
    });
}


async function GetNextPostId() {
    let res = await fetch(POST_API);
    let posts = await res.json();
    let maxId = Math.max(...posts.map(p => parseInt(p.id)));
    return (maxId + 1).toString();
}

async function SavePost() {
    let id = document.getElementById("post_id").value.trim();
    let title = document.getElementById("post_title").value;
    let views = document.getElementById("post_views").value;

    if (id) {
        await fetch(POST_API + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, views })
        });
    } else {
        let newId = await GetNextPostId();
        await fetch(POST_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                title,
                views,
                isDeleted: false
            })
        });
    }
    GetPosts();
}

async function SoftDeletePost(id) {
    await fetch(POST_API + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    GetPosts();
}

/* ================= COMMENT ================= */

async function GetComments() {
    let res = await fetch(COMMENT_API);
    let comments = await res.json();

    let tbody = document.getElementById("comment-body");
    tbody.innerHTML = "";

    comments.forEach(c => {
        let cls = c.isDeleted ? "deleted" : "";

        tbody.innerHTML += `
        <tr class="${cls}">
            <td>${c.id}</td>
            <td>${c.postId}</td>
            <td>${c.text}</td>
            <td>
                ${c.isDeleted
                ? `<button onclick="RestoreComment('${c.id}')">Restore</button>`
                : `<button onclick="SoftDeleteComment('${c.id}')">Delete</button>`
            }
            </td>
        </tr>`;
    });
}


async function GetNextCommentId() {
    let res = await fetch(COMMENT_API);
    let comments = await res.json();
    let maxId = Math.max(...comments.map(c => parseInt(c.id)));
    return (maxId + 1).toString();
}

async function SaveComment() {
    let id = document.getElementById("comment_id").value.trim();
    let postId = document.getElementById("comment_postId").value;
    let text = document.getElementById("comment_text").value;

    if (id) {
        await fetch(COMMENT_API + "/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, text })
        });
    } else {
        let newId = await GetNextCommentId();
        await fetch(COMMENT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                postId,
                text,
                isDeleted: false
            })
        });
    }
    GetComments();
}

async function SoftDeleteComment(id) {
    await fetch(COMMENT_API + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    GetComments();
}
async function RestorePost(id) {
    await fetch(POST_API + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    });
    GetPosts();
}
async function RestoreComment(id) {
    await fetch(COMMENT_API + "/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    });
    GetComments();
}

GetComments();
