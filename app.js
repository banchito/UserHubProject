const BASE_URL = "https://jsonplace-univclone.herokuapp.com";

const users_URL = `${BASE_URL}/users`;

// Getting Users
function fetchUsers() {
  return fetch(users_URL)
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.error(error);
    });
}

// Templating
function renderUser(user) {
    //header
    let name     = user.name
    let userName = user.username
    // section company info
    let email   = user.email
    let company = user.company.name
    let moto    = user.company.catchPhrase
    // footer posts & albums

    let header          = $('<header>')
    let section         = $('<section class="company-info">')
    
    let footer          = $('<footer>')
    let buttonPost      = $('<button class="load-posts">').text(`Posts by ${userName}`)
    let buttonAlbum     = $('<button class="load-albums">').text(`Albums by ${userName}`)

    let userElem = $('<div class="user-card">').append(
        header.append(`<h2>${name}</h2>`),
        section.append(
            `<p><b>Contact: </b>${email}</p>`,
            `<p><b>Works for: </b>${company}</p>`,
            `<p><b>Company creed: </b>${moto}</p>`
            ),
        footer.append(buttonPost, buttonAlbum)
        );
        userElem.data("user", user)
    return userElem
}

// Loop & append
function renderUserList(userList) {
    $("#user-list").empty();
    userList.forEach(function(user){
        const userElem = renderUser(user)
        $("#user-list").append(userElem)
    })
}

//simplified way of chainnig the promise from fecth user:
//fetchUsers().then(renderUserList);

function bootstrap() {
  fetchUsers().then(function (data) {
    console.log(data);
    renderUserList(data);
  });
  
}

$('#user-list').on('click', '.user-card .load-posts', function () {
    let parent  = $(this).closest(".user-card")
    console.log(parent.data("user"))

    
});
  
$('#user-list').on('click', '.user-card .load-albums', function () {
    let parent = $(this).closest('.user-card')
    console.log(parent.data("user"))
});   


bootstrap()