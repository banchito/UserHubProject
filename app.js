const BASE_URL = "https://jsonplace-univclone.herokuapp.com";

const users_URL = `${BASE_URL}/users`;

const queryObj = {
  _expand: "user",
  _embed: "photos",
};

// Build the query for user posts
const query_user_posts = Object.entries(queryObj).map(function (line) {
  return line.join("=");
});

// Build the query for album List
const query_album_list = Object.entries(queryObj)
  .map(function (line) {
    return line.join("=");
  })
  .join("&");

// Fetching data with url provided by helper func's
function fetchData(url) {
  return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Helper Function fetching users
function fetchUsers() {
  return fetchData(users_URL);
}

// Helper Function fetching users' albums
function fetchUserAlbumList(userId) {
  return fetchData(`${users_URL}/${userId}/albums?${query_album_list}`);
}

// Helper Function fetching users' posts
function fetchUserPosts(userId) {
  return fetchData(`${users_URL}/${userId}/posts?${query_user_posts[0]}`);
}

// Helper Function fetching posts' comments
function fetchPostComments(postId) {
  return fetchData(`${BASE_URL}/posts/${postId}/comments`);
}

function setCommentsOnPost(post) {
  if (post.comments) {
    return Promise.reject(null);
  }

  return fetchPostComments(post.id).then(function (comments) {
    post.comments = comments;
    return post;
  });
}

// users template
function renderUser(user) {
  //header
  let name = user.name;
  let userName = user.username;
  // section company info
  let email = user.email;
  let company = user.company.name;
  let moto = user.company.catchPhrase;
  // footer posts & albums

  let header = $("<header>");
  let section = $('<section class="company-info">');

  let footer = $("<footer>");
  let buttonPost = $('<button class="load-posts">').text(
    `Posts by ${userName}`
  );
  let buttonAlbum = $('<button class="load-albums">').text(
    `Albums by ${userName}`
  );

  let userElem = $('<div class="user-card">').append(
    header.append(`<h2>${name}</h2>`),
    section.append(
      `<p><b>Contact: </b>${email}</p>`,
      `<p><b>Works for: </b>${company}</p>`,
      `<p><b>Company creed: </b>${moto}</p>`
    ),
    footer.append(buttonPost, buttonAlbum)
  );
  userElem.data("user", user);
  return userElem;
}

// render an array of users
function renderUserList(userList) {
  $("#user-list").empty();

  userList.forEach(function (user) {
    const userElem = renderUser(user);
    $("#user-list").append(userElem);
  });
}

// album template
function renderAlbum(album) {
  const albumElem = $(`<div class="album-card">
     <header>
       <h3>${album.title}, by ${album.user.username} </h3>
     </header>
     <section class="photo-list"></section>
   </div>`);

  const photoListClass = albumElem.find(".photo-list");

  album.photos.forEach(function (photo) {
    const photoElem = renderPhoto(photo);
    photoListClass.append(photoElem);
  });
  return albumElem;
}

// photo template
function renderPhoto(photo) {
  return `<div class="photo-card">
        <a href="${photo.url}" target="_blank">
          <img src="${photo.thumbnailUrl}">
          <figure>${photo.title}</figure>
        </a>
    </div>`;
}

// render an array of albums
function renderAlbumList(albumList) {

  $("#app section.active").removeClass("active");
  $("#album-list").empty().addClass("active");

  albumList.forEach(function (album) {
    const albumElem = renderAlbum(album);
    $("#album-list").append(albumElem);
  });
}

// post template
function renderPost(post) {
let postElem = $(`<div class="post-card">
    <header>
      <h3>
        ${post.title}
      </h3>
      <h3>--- ${post.user.username}</h3>
    </header>
    <p>${post.body}</p>
    <footer>
      <div class="comment-list"></div>
      <a href="#" class="toggle-comments">
        (<span class="verb">show</span> comments)
      </a>
    </footer>
  </div>`);
  postElem.data('post', post)
  return postElem
}

// render a list of post
function renderPostList(postList) {
    $("#app section.active").removeClass("active");
    $("#post-list").empty().addClass("active");

    postList.forEach(function(post){
        const postListElem = renderPost(post);
        $('#post-list').append(postListElem)
    })
}

// toggle comments from posts
function toggleComments(postCardElement) {
    const footerElement = postCardElement.find('footer');
  
    if (footerElement.hasClass('comments-open')) {
      footerElement.removeClass('comments-open');
      footerElement.find('.verb').text('show');
    } else {
      footerElement.addClass('comments-open');
      footerElement.find('.verb').text('hide');
    }
  }

function bootstrap() {
  fetchUsers().then(function (data) {
    renderUserList(data);
  });
}

//Event Listeners

// Toogle comments button
$('#post-list').on('click', '.post-card .toggle-comments', function () {
    const postCardElement = $(this).closest('.post-card');
    const post = postCardElement.data('post');
    const commentListElem = postCardElement.find('.comment-list')
  
    setCommentsOnPost(post)
      .then(function (post) {
        commentListElem.empty()
        post.comments.forEach(function(comment){
            commentListElem.prepend($(` <h3>${ comment.body } --- ${ comment.email }</h3>`));
        })
        toggleComments(postCardElement)
      })
      .catch(function () {
        
        toggleComments(postCardElement)
      });
  });

//Loading Posts button
$("#user-list").on("click", ".user-card .load-posts", function () {
  let parent = $(this).closest(".user-card").data("user");

  fetchUserPosts(parent.id).then(renderPostList);
});

//Loading Albums button
$("#user-list").on("click", ".user-card .load-albums", function () {
  let parent = $(this).closest(".user-card").data("user");
  fetchUserAlbumList(parent.id).then(function (albumList) {
    renderAlbumList(albumList);
  });
});

bootstrap();
