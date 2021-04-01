const BASE_URL = "https://jsonplace-univclone.herokuapp.com";

const users_URL = `${BASE_URL}/users`;

const queryObj = {
  _expand: "user",
  _embed: "photos"
};

const QUERY = Object.entries(queryObj)
  .map(function (line) {
    return line.join("=");
  })
  .join("&");


// Fetching data with url provided by helper func's
function fetchData(url) {
    return fetch(url)
    .then(function(response){
        return response.json()
    })
    .catch(function(error){
        console.error(error)
    })
}

// Helper Function fetching users 
function fetchUsers() {
  return fetchData(users_URL)
}

// Helper Function fetching users' albums
function fetchUserAlbumList(userId) {
  return fetchData(`${users_URL}/${userId}/albums?${QUERY}`)  
}

//fetchUserAlbumList(1).then(renderAlbumList) 




// Templating
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

/* render a single album */
function renderAlbum(album) {
    let albumElem = 
    `<div class="album-card">
     <header>
       <h3>${album.title} </h3>
     </header>
     <section class="photo-list">
     </section>
   </div>`

    album.photos.forEach(function(photo){
        const photoElem = renderPhoto(photo)
        $('.photo-list').append(photoElem)
    })

   return albumElem
}
// render an array of albums 
function renderAlbumList(albumList) {
    
    $('#app section.active').removeClass('active')
    $('#album-list').addClass('active')
    $('#album-list').empty()

    albumList.forEach(function(album){
        const albumElem = renderAlbum(album)
        $('#album-list').append(albumElem)
    })
}

// render a single photo 
function renderPhoto(photo) {
    let photoElem = 
    `<div class="photo-card">
        <a href=${photo.url} target="_blank">
          <img src=${photo.url}>
          <figure>${photo.title}</figure>
        </a>
    </div>`
    return photoElem
}


//simplified way of chainnig the promise from fecth user:
//fetchUsers().then(renderUserList);
function bootstrap() {
  fetchUsers().then(function (data) {
    console.log(data);
    renderUserList(data);
  });
  
}

$("#user-list").on("click", ".user-card .load-posts", function () {
  let parent = $(this).closest(".user-card");
  console.log(parent.data("user"));
});

$("#user-list").on("click", ".user-card .load-albums", function () {
  let parent = $(this).closest(".user-card");
  let userID = parent.data("user").id
  
  fetchUserAlbumList(userID).then(renderAlbumList)
  
});

bootstrap();
