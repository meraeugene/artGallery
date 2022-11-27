const grid = document.querySelector(".grid");
const searchBar = document.querySelector("#input");
const searchBtn = document.querySelector("#submit");
const configURL = "https://www.artic.edu/iiif/2";

const macyInstance = Macy({
  container: grid,
  margin: 15,
  breakAt: {
    1600: 3,
    1200: 3,
    900: 2,
    600: 2,
    400: 1,
  },
});

fetch("https://api.artic.edu/api/v1/artworks?page=1&limit=100")
  .then((res) => res.json())
  .then((data) => {
    showImage(data);
    searchFunction(data);
    searchBarInput(data);
  })
  .catch((err) => console.log(err));

const showImage = (array) => {
  fixStartupBug();
  let container = "";

  const paintings = array.data;
  //mapped into artist and title
  users = paintings.map((paint) => {
    return {
      title: paint.title,
      imageID: paint.image_id,
      artist: paint.artist_title,
      place: paint.place_of_origin,
      date: paint.date_start,
    };
  });

  users.forEach((paint) => {
    if (paint.imageID !== null) {
      const paintImages = `${configURL}/${paint.imageID}/full/843,/0/default.jpg`;
      container += `  
        <div class="img-container">
          <img src="${paintImages}" alt="" />
        <div class="info">
        <p class="title"><span>Artist:</span> ${paint.artist}</p>
        <p class="title"><span>Title:</span> ${paint.title}</p>
        <p class="title"><span>Place:</span> ${paint.place} (Object made in)</p>
        <p class="title"><span>Date:</span> ${paint.date}</p>
      </div>
      </div>`;
    }
  });
  grid.innerHTML = container;
};

const fixStartupBug = () => {
  macyInstance.runOnImageLoad(function () {
    macyInstance.recalculate(true, true);
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
  }, true);
};

const searchFunction = (array) => {
  fixStartupBug();

  const paintings = array.data;
  //mapped into artist and title
  users = paintings.map((paint) => {
    return {
      title: paint.title,
      imageID: paint.image_id,
      artist: paint.artist_title,
    };
  });

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fixStartupBug();
    const query = searchBar.value.toLowerCase();

    users.forEach((user) => {
      const titleLowerCase = user.title.toLowerCase();
      const title = user.title;
      const artist = user.artist;
      const paintImages = `${configURL}/${user.imageID}/full/1686,/0/default.jpg`;

      if (query == titleLowerCase) {
        grid.innerHTML = ` <div class="img-container">
        <img src="${paintImages}" alt="" />
      <div class="info">
      <p class="title">${title}</p>
      <p class="artist">${artist}</p>
    </div>
    </div>`;
      }
    });
  });
};

const searchBarInput = (array) => {
  searchBar.addEventListener("input", () => {
    const value = searchBar.value;

    if (!value) {
      showImage(array);
    }
  });
};
